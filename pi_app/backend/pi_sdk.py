import requests
from config import API_KEY, PI_BASE_URL

headers = {
    "Authorization": f"Key {API_KEY}",
    "Content-Type": "application/json"
}

def check_payment(payment_id):
    """Check the status of a payment."""
    response = requests.get(f"{PI_BASE_URL}payments/{payment_id}", headers=headers)
    return response.json() if response.status_code == 200 else response.text

def approve_payment(payment_id):
    """Approve a payment before completion."""
    response = requests.post(f"{PI_BASE_URL}payments/{payment_id}/approve", headers=headers)
    return response.json() if response.status_code == 200 else response.text

def complete_payment(payment_id, txid):
    """Complete the payment after the transaction is verified."""
    data = {"txid": txid}
    response = requests.post(f"{PI_BASE_URL}payments/{payment_id}/complete", headers=headers, json=data)
    return response.json() if response.status_code == 200 else response.text

