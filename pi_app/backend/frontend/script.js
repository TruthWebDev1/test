Pi.init({ version: "2.0", sandbox: true });

async function authenticateUser() {
    try {
        const scopes = ["payments"];
        const user = await Pi.authenticate(scopes, function (payment) {
            console.log("Incomplete Payment Found:", payment);
        });
        console.log("User authenticated:", user);
    } catch (error) {
        console.error("Authentication error:", error);
    }
}

async function startPayment() {
    try {
        const payment = await Pi.createPayment({
            amount: 1, // Amount in Pi
            memo: "Test Payment",
            metadata: { productId: "12345" }
        });

        console.log("Payment initiated:", payment);
    } catch (error) {
        console.error("Payment error:", error);
    }
}
