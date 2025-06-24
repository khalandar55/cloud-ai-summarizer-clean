print("Dummy test: success")
# /home/src/tests/run_tests.py

import unittest
import requests

BASE_URL = "http://localhost:5001"

class TestDocumentSummarizerAPI(unittest.TestCase):
    def test_upload_endpoint(self):
        """Test if /upload accepts valid text"""
        data = {"text": "This is a test document about cloud computing."}
        res = requests.post(f"{BASE_URL}/upload", json=data)
        self.assertEqual(res.status_code, 200)
        self.assertIn("success", res.json()["status"].lower())

    def test_ask_endpoint_with_prompt(self):
        """Test if /ask returns a valid summary"""
        data = {"prompt": "Summarize the text"}
        res = requests.post(f"{BASE_URL}/ask", json=data)
        self.assertEqual(res.status_code, 200)
        response = res.json()
        self.assertIn("response", response)
        self.assertTrue(len(response["response"]) > 0)

    def test_ask_without_upload_or_prompt(self):
        """Test error handling when no text or prompt is given"""
        res = requests.post(f"{BASE_URL}/ask", json={"prompt": ""})
        self.assertEqual(res.status_code, 200)
        self.assertIn("No document uploaded", res.json()["response"])

if __name__ == "__main__":
    unittest.main()
