from flask import Blueprint, request, jsonify
import requests
from config import PI_API_KEY, PI_API_BASE_URL

# Create the Blueprint
payments_bp = Blueprint('payments', __name__)

# Payment route to handle incomplete payments and verification
@payments_bp.route('/payment/complete', methods=['POST'])
def complete_payment():
    # Receive paymentId and txid from the frontend
    data = request.json
    payment_id = data.get('paymentId')
    txid = data.get('txid')

    # Handle missing data
    if not payment_id or not txid:
        return jsonify({"error": "Missing paymentId or txid"}), 400

    # Prepare request headers and payload
    headers = {
        'Authorization': f"Key {PI_API_KEY}"
    }
    payload = {
        "payment_id": payment_id,
        "txid": txid
    }

    # Call Pi API to complete the payment
    try:
        response = requests.post(f"{PI_API_BASE_URL}/complete", headers=headers, json=payload)
        response_data = response.json()

        # Handle success
        if response.status_code == 200:
            return jsonify({"message": "Payment completed successfully!", "response": response_data}), 200
        else:
            return jsonify({"error": "Payment failed", "details": response_data}), response.status_code

    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500
