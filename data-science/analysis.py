import pandas as pd
import matplotlib.pyplot as plt

data = [
    {"name": "Arduino Kit", "category": "Hardware", "quantity": 5, "status": "Available"},
    {"name": "Figma License", "category": "Software", "quantity": 20, "status": "Available"},
    {"name": "Raspberry Pi", "category": "Hardware", "quantity": 2, "status": "Low"},
]

df = pd.DataFrame(data)


total_items = df["quantity"].sum()
print("Total Items:", total_items)


category_summary = df.groupby("category")["quantity"].sum()
print("\nItems by Category:")
print(category_summary)


low_stock = df[df["quantity"] < 5]
print("\nLow Stock Items:")
print(low_stock)


category_summary.plot(kind="bar")
plt.title("Inventory by Category")
plt.show()