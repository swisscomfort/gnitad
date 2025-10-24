import os
import json
from pathlib import Path

# Project Root
PROJECT_ROOT = Path(__file__).parent.parent.parent

class Config:
    """Application Configuration"""
    
    # Environment
    ENV = os.getenv('ENV', 'development')
    DEBUG = ENV == 'development'
    
    # API
    API_HOST = os.getenv('API_HOST', 'http://localhost:3000')
    API_KEY = os.getenv('API_KEY', '')
    
    # ML Models
    MODEL_PATH = PROJECT_ROOT / 'services' / 'ml' / 'models'
    DATA_PATH = PROJECT_ROOT / 'data'
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = PROJECT_ROOT / 'logs' / 'ml.log'
    
    # Redis
    REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
    REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
    REDIS_DB = int(os.getenv('REDIS_DB', 0))
    
    @classmethod
    def get_config(cls):
        return {
            'env': cls.ENV,
            'debug': cls.DEBUG,
            'api_host': cls.API_HOST,
            'model_path': str(cls.MODEL_PATH),
            'data_path': str(cls.DATA_PATH),
            'log_level': cls.LOG_LEVEL,
        }
