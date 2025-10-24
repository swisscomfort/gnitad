import logging
import sys
from pathlib import Path
from config import Config

# Setup logging
def setup_logging():
    log_file = Path(Config.LOG_FILE)
    log_file.parent.mkdir(exist_ok=True, parents=True)
    
    logger = logging.getLogger('ml_service')
    logger.setLevel(Config.LOG_LEVEL)
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(Config.LOG_LEVEL)
    
    # File handler
    file_handler = logging.FileHandler(log_file)
    file_handler.setLevel(Config.LOG_LEVEL)
    
    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(formatter)
    file_handler.setFormatter(formatter)
    
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    
    return logger

logger = setup_logging()
