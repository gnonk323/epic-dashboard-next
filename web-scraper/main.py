import json
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from datetime import datetime, timezone

from scraper import scrape_snow_report, scrape_trails_status


load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client['mountain_data']
collection = db['reports']


def load_mountains() -> list[dict]:
  try:
    with open('mountains.json', 'r') as f:
      mountains = json.load(f)
    print("Loaded mountains.json")
    return mountains
  except FileNotFoundError:
    print("mountains.json not found")
    return []
  except json.JSONDecodeError as e:
    print("decode error", e)
    return []


def scrape_all() -> dict[str, dict]:
  mountains = load_mountains()
  reports: dict[str, dict] = {}

  for mountain in mountains:
    name = mountain['name']
    snow_report_url = mountain['snow_report_url']
    trails_status_url = mountain['trails_status_url']
    print(f"Scraping data for mountain: {name}...")
    snow_report = scrape_snow_report(snow_report_url)
    print("Snow report finished")
    trails_status = scrape_trails_status(trails_status_url)
    print("Trail status finished")

    report = {
      "snow_report": snow_report,
      "trails_status": trails_status,
    }

    reports[name] = report

  return reports


def save_reports_to_db(reports: dict):
  document = {
    "reports": reports,
    "timestamp": datetime.now(timezone.utc)
  }
  collection.insert_one(document)
  print("Saved new reports to DB")


def scrape_and_save():
  reports = scrape_all()
  save_reports_to_db(reports)


if __name__ == "__main__":
  scrape_and_save()
