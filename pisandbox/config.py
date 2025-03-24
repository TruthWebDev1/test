import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# API Configuration
PI_API_KEY = os.getenv("PI_API_KEY")
PI_API_BASE_URL = "https://api.minepi.com/v2/payments"
