import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Add backend directory to path
backend_dir = Path(r"c:\Users\Work\code\vnr-ace-backend").resolve()
sys.path.append(str(backend_dir))
load_dotenv(backend_dir / ".env")

from sqlalchemy import select, func
from core.db import async_session
from models.placement_offer_v2 import PlacementOfferV2
from models.student import Student

async def check():
    try:
        async with async_session() as db:
            print("DB connected.")
            offers = (await db.execute(select(func.count(PlacementOfferV2.id)))).scalar()
            students = (await db.execute(select(func.count(Student.id)))).scalar()
            print(f"Offers count: {offers}")
            print(f"Students count: {students}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(check())
