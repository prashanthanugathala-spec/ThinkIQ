import os
from dotenv import load_dotenv
import urllib.parse

load_dotenv()

class Settings:
    PROJECT_NAME: str = "TalentIQ AI Backend"
    VERSION: str = "1.1.0"
    API_V1_STR: str = "/api"
    
    # Auth & API Keys
    CLERK_SECRET_KEY: str = os.getenv("CLERK_SECRET_KEY", "")
    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", os.getenv("LLM_API_KEY", ""))
    
    # Database
    USE_SQLITE: bool = os.getenv("USE_SQLITE", "False").lower() in ("true", "1", "t")
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: str = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DATABASE: str = os.getenv("MYSQL_DATABASE", "talentiq")
    
    @property
    def DATABASE_URL(self) -> str:
        if self.USE_SQLITE:
            return "sqlite:///./talentiq.db"
        encoded_password = urllib.parse.quote_plus(self.MYSQL_PASSWORD)
        return f"mysql+pymysql://{self.MYSQL_USER}:{encoded_password}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"

settings = Settings()
