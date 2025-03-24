from flask import Blueprint, request, jsonify
from pi_sdk import check_payment, approve_payment, complete_payment

payment_bp = Blueprint("payments", __name__)

@payment_bp.route("/payment/check/<payment_id>", methods=["GET"])
def check(payment_id):
    return jsonify(check_payment(payment_id))

@payment_bp.route("/payment/approve/<payment_id>", methods=["POST"])
def approve(payment_id):
    return jsonify(approve_payment(payment_id))

@payment_bp.route("/payment/complete", methods=["POST"])
def complete():
    data = request.json
    return jsonify(complete_payment(data["paymentId"], data["txid"]))

