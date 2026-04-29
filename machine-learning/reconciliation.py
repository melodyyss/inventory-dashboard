import json
from datetime import datetime

CONF_THRESHOLD = 0.90

inventory_db = [
    {
        "id": 1,
        "name": "Arduino Kit",
        "category": "Hardware",
        "quantity": 5,
        "status": "Available",
    },
    {
        "id": 2,
        "name": "USB Cable",
        "category": "Hardware",
        "quantity": 0,
        "status": "Unavailable",
    },
    {
        "id": 3,
        "name": "Figma License",
        "category": "Software",
        "quantity": 20,
        "status": "Available",
    },
]

with open("predictions.json", "r") as file:
    scenes = json.load(file)

inventory_lookup = {item["name"]: item for item in inventory_db}

accepted_predictions = []
uncertain_predictions = []
audit_events = []

for scene in scenes:
    scene_id = scene["scene_id"]

    for prediction in scene["predictions"]:
        prediction_record = {
            "scene_id": scene_id,
            "name": prediction["name"],
            "confidence": prediction["confidence"],
        }

        if prediction["confidence"] >= CONF_THRESHOLD:
            accepted_predictions.append(prediction_record)
        else:
            uncertain_predictions.append(prediction_record)

            audit_events.append({
                "timestamp": datetime.now().isoformat(),
                "scene_id": scene_id,
                "item": prediction["name"],
                "event_type": "UNCERTAIN",
                "confidence": prediction["confidence"],
                "recommended_action": "Manual review required due to low confidence",
            })

for prediction in accepted_predictions:
    item = inventory_lookup.get(prediction["name"])

    if item and item["quantity"] > 0:
        event_type = "VERIFIED"
        recommended_action = "No action needed"
    else:
        event_type = "DISCREPANCY"
        recommended_action = "Manual review: shelf image predicts item exists, but database says unavailable"

    audit_events.append({
        "timestamp": datetime.now().isoformat(),
        "scene_id": prediction["scene_id"],
        "item": prediction["name"],
        "event_type": event_type,
        "confidence": prediction["confidence"],
        "recommended_action": recommended_action,
    })

with open("audit_log.jsonl", "w") as file:
    for event in audit_events:
        file.write(json.dumps(event) + "\n")

print("Accepted predictions count:", len(accepted_predictions))
print("Uncertain predictions count:", len(uncertain_predictions))

print("\nUncertain items per scene:")
for item in uncertain_predictions:
    print(f"{item['scene_id']}: {item['name']} ({item['confidence']})")

print("\nAudit events:")
for event in audit_events:
    print(event)

print("\nAudit log created: audit_log.jsonl")