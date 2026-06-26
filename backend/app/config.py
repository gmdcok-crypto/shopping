from pydantic import AliasChoices, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = Field(
        default="mysql+pymysql://root:password@localhost:3306/haral",
        validation_alias=AliasChoices("DATABASE_URL", "MYSQL_URL"),
    )
    api_prefix: str = "/api"
    cors_origins: str = ""

    # Cloudflare R2 (S3-compatible)
    r2_account_id: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = ""
    r2_public_base_url: str = ""

    # Admin upload / product management
    admin_api_key: str = ""

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        if isinstance(value, str):
            if value.startswith("mysql://"):
                return value.replace("mysql://", "mysql+pymysql://", 1)
        return value

    @property
    def r2_configured(self) -> bool:
        return bool(
            self.r2_account_id
            and self.r2_access_key_id
            and self.r2_secret_access_key
            and self.r2_bucket_name
            and self.r2_public_base_url
        )


settings = Settings()
