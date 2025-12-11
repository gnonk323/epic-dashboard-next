import re
import json
import requests
from datetime import datetime, timezone
from bs4 import BeautifulSoup
import pandas as pd

def safe_int(val):
  try:
    return int(val)
  except:
    return None


def scrape_snow_report(url: str) -> dict:
  resp = requests.get(url, timeout=12)
  resp.raise_for_status()
  html = resp.text
  soup = BeautifulSoup(html, "html.parser")

  script_tags = soup.find_all("script")
  data_obj = None

  # Regex to find the FR.snowReportData JSON object
  pattern = r"FR\.snowReportData\s*=\s*(\{.*?\});"

  for script in script_tags:
    if script.string and "FR.snowReportData" in script.string:
      match = re.search(pattern, script.string, re.DOTALL)
      if match:
        json_str = match.group(1)
        data_obj = json.loads(json_str)
        break
  
  if data_obj is None:
    return {
      "source_url": url,
      "fetched_at": datetime.now(timezone.utc).isoformat(),
      "error": "Could not find FR.snowReportData"
    }
  
  commentary_div = soup.find("div", class_="resort_commentary__body")
  commentary_text = commentary_div.get_text() if commentary_div else None
  
  last_updated_text = data_obj.get("LastUpdatedText")
  format_string = "Updated %B %d, %Y at %I:%M %p %Z" 
  dt = pd.to_datetime(last_updated_text, format=format_string)
  last_updated_utc = dt.tz_convert("UTC").isoformat()

  result = {
    "source_url": url,
    "fetched_at": datetime.now(timezone.utc).isoformat(),
    "updated_at": last_updated_utc,
    "overall_conditions": data_obj.get("OverallSnowConditions"),
    "resort_commentary": commentary_text,
    "metrics": {
      "24_hour": {
        "in": safe_int(data_obj["TwentyFourHourSnowfall"]["Inches"]),
        "cm": safe_int(data_obj["TwentyFourHourSnowfall"]["Centimeters"]),
      },
      "48_hour": {
        "in": safe_int(data_obj["FortyEightHourSnowfall"]["Inches"]),
        "cm": safe_int(data_obj["FortyEightHourSnowfall"]["Centimeters"]),
      },
      "7_day": {
        "in": safe_int(data_obj["SevenDaySnowfall"]["Inches"]),
        "cm": safe_int(data_obj["SevenDaySnowfall"]["Centimeters"]),
      },
      "base_depth": {
        "in": safe_int(data_obj["BaseDepth"]["Inches"]),
        "cm": safe_int(data_obj["BaseDepth"]["Centimeters"]),
      },
      "season_total": {
        "in": safe_int(data_obj["CurrentSeason"]["Inches"]),
        "cm": safe_int(data_obj["CurrentSeason"]["Centimeters"]),
      },
    }
  }

  return result


def scrape_trails_status(url: str) -> dict:
  resp = requests.get(url, timeout=12)
  resp.raise_for_status()
  html = resp.text
  soup = BeautifulSoup(html, "html.parser")

  runs_div = soup.find("div", attrs={"data-terrain-status-id": "runs"})

  open_trails = None
  total_trails = None
  error = None

  if runs_div:
    circle_div = runs_div.find("div", class_="terrain_summary__circle")
    
    if circle_div:
      open_trails = safe_int(circle_div.get("data-open"))
      total_trails = safe_int(circle_div.get("data-total"))
    else:
      error = "Could not find terrain_summary__circle div within runs status div."
  else:
    error = "Could not find the div for trails status (data-terrain-status-id='runs')."

  result = {
    "source_url": url,
    "fetched_at": datetime.now(timezone.utc).isoformat(),
    "trails": {
      "open": open_trails,
      "total": total_trails,
    }
  }
  
  if error:
    result["error"] = error
    
  return result