from locust import HttpUser, task, between

class OptiRouteUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def test_health(self):
        self.client.get("/api/v1/health")

    @task(5)
    def test_prompt_process(self):
        self.client.post("/api/v1/prompt/process", json={
            "prompt": "Explain artificial intelligence in simple terms."
        })

    @task(2)
    def test_analytics(self):
        self.client.get("/api/v1/analytics/overview")

    @task(1)
    def test_routing_simulation(self):
        self.client.post("/api/v1/routing/test", json={
            "prompt": "Design a high availability microservices backend."
        })
