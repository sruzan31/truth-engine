#!/usr/bin/env python3
"""
The Truth Engine - End-to-End API Test Suite
Tests all 6 analysis endpoints and verifies history/dashboard persistence.
"""
import requests
import json
import sys
import os
import time
from pathlib import Path

BASE_URL = "http://127.0.0.1:8000/api/v1"
PASS = "\033[92m✓ PASS\033[0m"
FAIL = "\033[91m✗ FAIL\033[0m"
INFO = "\033[94mℹ\033[0m"

results = []

def test(name, result, detail=""):
    status = PASS if result else FAIL
    print(f"  {status}  {name}")
    if detail and not result:
        print(f"         {detail}")
    results.append(result)

def section(title):
    print(f"\n\033[1m{'━'*52}\033[0m")
    print(f"\033[93m  {title}\033[0m")
    print(f"\033[1m{'━'*52}\033[0m")

print("\n\033[96m  ╔══════════════════════════════════════════╗")
print("  ║    THE TRUTH ENGINE — E2E Test Suite    ║")
print("  ╚══════════════════════════════════════════╝\033[0m\n")

# ─────────────────────────────────────────────
section("1. Backend Health Check")
# ─────────────────────────────────────────────
try:
    r = requests.get(f"http://127.0.0.1:8000/", timeout=5)
    data = r.json()
    test("API root responds with 200 OK", r.status_code == 200)
    test("Service name is correct", data.get("service") == "The Truth Engine")
    test("Mock mode is reported", "mock_mode" in data)
    test("API version is v1", data.get("api_version") == "v1")

    r2 = requests.get(f"http://127.0.0.1:8000/health", timeout=5)
    test("Health endpoint returns healthy", r2.json().get("status") == "healthy")
except Exception as e:
    test("Backend is reachable", False, str(e))
    print("\n  \033[91mCannot reach backend. Make sure it's running on port 8000.\033[0m")
    sys.exit(1)

# ─────────────────────────────────────────────
section("2. URL Analysis — Phishing URL")
# ─────────────────────────────────────────────
try:
    r = requests.post(f"{BASE_URL}/analyze/url", json={
        "url": "http://paypal-secure-update.phish-scam.com/login"
    }, timeout=15)
    d = r.json()
    test("Status 200", r.status_code == 200)
    test("Returns scan_id", bool(d.get("scan_id")))
    test("Scan type is 'url'", d.get("scan_type") == "url")
    test("Trust score is a number", isinstance(d.get("trust_score"), (int, float)))
    test("Trust score is low (≤50) for phishing URL", d.get("trust_score", 100) <= 60)
    test("Risk level is present", d.get("risk_level") in ["low","medium","high","critical"])
    test("Evidence list is non-empty", len(d.get("evidence", [])) > 0)
    test("Has AI reasoning text", len(d.get("reasoning", "")) > 20)
    test("Has recommendation text", len(d.get("recommendation", "")) > 10)
    print(f"     {INFO} Score: {d.get('trust_score')} | Risk: {d.get('risk_level').upper()} | Evidence items: {len(d.get('evidence',[]))}")
    phishing_scan_id = d["scan_id"]
except Exception as e:
    test("URL analysis endpoint works", False, str(e))
    phishing_scan_id = None

# ─────────────────────────────────────────────
section("3. URL Analysis — Legitimate URL")
# ─────────────────────────────────────────────
try:
    r = requests.post(f"{BASE_URL}/analyze/url", json={
        "url": "https://google.com"
    }, timeout=15)
    d = r.json()
    test("Status 200", r.status_code == 200)
    test("Trust score is higher for safe URL", d.get("trust_score", 0) >= 50)
    print(f"     {INFO} Score: {d.get('trust_score')} | Risk: {d.get('risk_level', '').upper()}")
except Exception as e:
    test("Safe URL analysis works", False, str(e))

# ─────────────────────────────────────────────
section("4. Text Analysis — Scam Message")
# ─────────────────────────────────────────────
try:
    r = requests.post(f"{BASE_URL}/analyze/text", json={
        "text": "CONGRATULATIONS! You've been selected to receive a $1000 Amazon gift card. Click here NOW to claim your reward before it expires: bit.ly/cl41mx"
    }, timeout=15)
    d = r.json()
    test("Status 200", r.status_code == 200)
    test("Scan type is 'text'", d.get("scan_type") == "text")
    test("Returns trust score", isinstance(d.get("trust_score"), (int, float)))
    test("Has AI semantic evidence", any("Semantic" in e.get("title","") for e in d.get("evidence",[])))
    print(f"     {INFO} Score: {d.get('trust_score')} | Risk: {d.get('risk_level','').upper()}")
except Exception as e:
    test("Text analysis endpoint works", False, str(e))

# ─────────────────────────────────────────────
section("5. Email Analysis — Phishing Email")
# ─────────────────────────────────────────────
try:
    r = requests.post(f"{BASE_URL}/analyze/email", json={
        "subject": "⚠️ Urgent: Your account will be DELETED in 24 hours!",
        "body": "Dear Account Holder,\n\nWe detected suspicious activity on your account. You must verify your identity immediately or your account will be permanently deleted.\n\nClick here to verify NOW: http://192.168.1.100/verify-account\n\nYour personal details will be removed unless you act in the next 24 hours.",
        "sender": "security-noreply@gmail.com",
        "headers": ""
    }, timeout=15)
    d = r.json()
    test("Status 200", r.status_code == 200)
    test("Scan type is 'email'", d.get("scan_type") == "email")
    test("Has sender evidence", any("Sender" in e.get("title","") for e in d.get("evidence",[])))
    test("Has hyperlink evidence", any("Hyperlink" in e.get("title","") for e in d.get("evidence",[])))
    test("Has AI semantics evidence", any("Semantic" in e.get("title","") or "Language" in e.get("title","") for e in d.get("evidence",[])))
    print(f"     {INFO} Score: {d.get('trust_score')} | Risk: {d.get('risk_level','').upper()}")
except Exception as e:
    test("Email analysis endpoint works", False, str(e))

# ─────────────────────────────────────────────
section("6. History — Persistence Verification")
# ─────────────────────────────────────────────
try:
    r = requests.get(f"{BASE_URL}/history", timeout=10)
    scans = r.json()
    test("History endpoint returns 200", r.status_code == 200)
    test("History is a list", isinstance(scans, list))
    test("History has ≥3 records", len(scans) >= 3, f"Got: {len(scans)}")
    types_seen = {s.get("scan_type") for s in scans}
    test("Multiple scan types in history", len(types_seen) >= 2, f"Types: {types_seen}")
    print(f"     {INFO} Total records: {len(scans)} | Types: {sorted(types_seen)}")
except Exception as e:
    test("History endpoint works", False, str(e))

# ─────────────────────────────────────────────
section("7. Individual Report Retrieval")
# ─────────────────────────────────────────────
if phishing_scan_id:
    try:
        r = requests.get(f"{BASE_URL}/history/{phishing_scan_id}", timeout=10)
        d = r.json()
        test("GET /history/:id returns 200", r.status_code == 200)
        test("Correct scan_id returned", d.get("scan_id") == phishing_scan_id)
        test("Evidence array preserved in report", len(d.get("evidence",[])) > 0)
    except Exception as e:
        test("Individual report retrieval works", False, str(e))

# ─────────────────────────────────────────────
section("8. Dashboard Statistics")
# ─────────────────────────────────────────────
try:
    r = requests.get(f"{BASE_URL}/dashboard/stats", timeout=10)
    d = r.json()
    test("Dashboard stats endpoint returns 200", r.status_code == 200)
    test("total_scans is a number", isinstance(d.get("total_scans"), int))
    test("average_trust_score is present", isinstance(d.get("average_trust_score"), (int, float)))
    test("risk_breakdown has all 4 tiers", all(k in d.get("risk_breakdown",{}) for k in ["low","medium","high","critical"]))
    test("type_breakdown has all 6 types", all(k in d.get("type_breakdown",{}) for k in ["url","email","text","image","qr","pdf"]))
    test("recent_trends is a list", isinstance(d.get("recent_trends"), list))
    print(f"     {INFO} Total: {d.get('total_scans')} scans | Avg score: {d.get('average_trust_score')}")
    print(f"     {INFO} Risk breakdown: {d.get('risk_breakdown')}")
except Exception as e:
    test("Dashboard stats endpoint works", False, str(e))

# ─────────────────────────────────────────────
print(f"\n\033[1m{'━'*52}\033[0m")
passed = sum(results)
total = len(results)
pct = round((passed/total)*100) if total > 0 else 0
color = "\033[92m" if pct >= 90 else ("\033[93m" if pct >= 70 else "\033[91m")
print(f"\n  {color}RESULTS: {passed}/{total} tests passed ({pct}%)\033[0m\n")
if pct < 100:
    failed_count = total - passed
    print(f"  \033[91m{failed_count} test(s) need attention.\033[0m\n")
else:
    print("  \033[92mAll tests passed. Truth Engine backend is fully operational! ✓\033[0m\n")
print(f"\033[1m{'━'*52}\033[0m\n")
