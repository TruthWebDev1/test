from flask import Flask, render_template
from routes.payments import payments_bp

app = Flask(__name__)

# Register blueprint
app.register_blueprint(payments_bp)

# Main route (Landing Page)
@app.route('/')
def index():
    return render_template('index.html')  # Display the main page

if __name__ == '__main__':
    app.run(debug=True)
