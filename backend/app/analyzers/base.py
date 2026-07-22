from abc import ABC, abstractmethod
from typing import List, Any
try:
    from app.models.schemas import EvidenceItem
except ImportError:
    from backend.app.models.schemas import EvidenceItem

class BaseAnalyzer(ABC):
    @abstractmethod
    def analyze(self, target: Any, **kwargs) -> List[EvidenceItem]:
        """
        Executes analysis and returns a list of evidence items.
        Each item is graded from 0 to 100 for safety, with weight 0.0 to 1.0.
        """
        pass
