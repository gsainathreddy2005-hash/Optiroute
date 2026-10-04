import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline

TRAINING_DATA = [
    # SIMPLE prompts
    ("What is machine learning?", "SIMPLE"),
    ("Define artificial intelligence.", "SIMPLE"),
    ("Who wrote Hamlet?", "SIMPLE"),
    ("What is the capital of France?", "SIMPLE"),
    ("Convert 10 meters to feet.", "SIMPLE"),
    ("Hi, how are you today?", "SIMPLE"),
    ("Translate 'thank you' to Spanish.", "SIMPLE"),
    ("What is 15 multiplied by 12?", "SIMPLE"),
    ("Define Python language.", "SIMPLE"),
    ("What does API stand for?", "SIMPLE"),
    ("Explain the word 'serendipity'.", "SIMPLE"),
    ("List 3 primary colors.", "SIMPLE"),
    ("What year did WWII end?", "SIMPLE"),
    ("How do I spell accommodation?", "SIMPLE"),
    ("Give me a synonym for happy.", "SIMPLE"),

    # MODERATE prompts
    ("Summarize the main themes of 1984 in three paragraphs.", "MODERATE"),
    ("Write a Python function to check if a string is a palindrome.", "MODERATE"),
    ("Compare and contrast REST APIs and GraphQL.", "MODERATE"),
    ("Explain how HTTP requests work step by step.", "MODERATE"),
    ("Draft a professional email asking for a meeting reschedule.", "MODERATE"),
    ("Write a SQL query to select all active users grouped by country.", "MODERATE"),
    ("Explain the difference between process and thread in operating systems.", "MODERATE"),
    ("How do I fix CORS issue in FastAPI backend?", "MODERATE"),
    ("Summarize this text into key bullet points.", "MODERATE"),
    ("Write a React hook for fetching data from an API.", "MODERATE"),
    ("Explain how gradient descent works in simple terms.", "MODERATE"),
    ("Create a 7-day workout plan for beginners.", "MODERATE"),
    ("Translate this news article into French with formal tone.", "MODERATE"),
    ("How do Docker containers differ from virtual machines?", "MODERATE"),

    # COMPLEX prompts
    ("Design a microservices architecture for a high-frequency trading platform handling 1M TPS.", "COMPLEX"),
    ("Refactor this 500-line legacy C++ memory management code to be thread-safe with zero data races.", "COMPLEX"),
    ("Derive the mathematical proof for backpropagation in deep neural networks with arbitrary activation functions.", "COMPLEX"),
    ("Analyze the geopolitical and economic implications of global semiconductor supply chain shifts.", "COMPLEX"),
    ("Write a complete custom compiler frontend in Rust for a toy imperative language.", "COMPLEX"),
    ("Architect a cost-aware multi-LLM routing engine with fallback mechanisms and real-time latency monitoring.", "COMPLEX"),
    ("Debug this complex distributed deadlock scenario across Redis, PostgreSQL, and Kafka cluster.", "COMPLEX"),
    ("Formulate a comprehensive cybersecurity strategy for zero-trust enterprise infrastructure.", "COMPLEX"),
    ("Provide a detailed step-by-step mathematical optimization proof for SVM dual formulation using KKT conditions.", "COMPLEX"),
    ("Write an enterprise-grade Kubernetes operator in Go to manage distributed database sharding.", "COMPLEX")
]

def train():
    texts, labels = zip(*TRAINING_DATA)

    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
        ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    pipeline.fit(texts, labels)

    os.makedirs("app/ml/model", exist_ok=True)
    model_path = "app/ml/model/complexity_model.pkl"
    joblib.dump(pipeline, model_path)
    print(f"Model trained and saved successfully to {model_path}")

if __name__ == "__main__":
    train()
