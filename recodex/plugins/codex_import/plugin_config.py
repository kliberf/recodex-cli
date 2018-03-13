from ruamel import yaml

from pathlib import Path
from typing import NamedTuple, Dict


class Config(NamedTuple):
    locale: str = "cs"

    extension_to_runtime: Dict[str, str] = {
        "cs": "mono46",
        "c": "c-gcc-linux",
        "pas": "freepascal-linux",
        "java": "java8",
        "cpp": "cxx11-gcc-linux"
    }

    judges: Dict[str, str] = {
        "bin/codex_judge": "recodex-judge-normal",
        "bin/codex_shufflejudge": "recodex-judge-shuffle",
        "diff": "diff"
    }

    @classmethod
    def load(cls, config_path: Path):
        config = yaml.safe_load(config_path.open("r"))
        return cls(**config)
