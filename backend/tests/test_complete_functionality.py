#!/usr/bin/env python3
import requests
import json
import uuid

BASE_URL = "http://localhost:8000/api"

def test_complete_functionality():
    
    unique_id = str(uuid.uuid4())[:8]
    username = f"testuser_{unique_id}"
    
    print(f"1. Registering a test user: {username}...")
    register_data = {
        "username": username,
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    assert response.status_code == 200, f"Failed to register user: {response.status_code} - {response.text}"
    
    user_data = response.json()
    print(f"User registered: {user_data['username']}")
    
    print("2. Logging in...")
    login_data = {
        "username": username,
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    assert response.status_code == 200, f"Failed to login: {response.status_code} - {response.text}"
    
    token_data = response.json()
    token = token_data['access_token']
    print("Login successful")
    
    print("3. Creating a test habit...")
    habit_data = {
        "name": "Test Habit",
        "description": "A test habit for completion testing"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/habits", json=habit_data, headers=headers)
    assert response.status_code == 200, f"Failed to create habit: {response.status_code} - {response.text}"
    
    habit = response.json()
    habit_id = habit['id']
    print(f"Habit created: {habit['name']} (ID: {habit_id})")
    print(f"Initial completed status: {habit.get('completed', 'Not set')}")
    
    print("4. Completing the habit...")
    response = requests.post(f"{BASE_URL}/habits/{habit_id}/complete", headers=headers)
    assert response.status_code == 204, f"Failed to complete habit: {response.status_code} - {response.text}"
    
    print("Habit completed successfully")
    
    print("5. Verifying completion status...")
    response = requests.get(f"{BASE_URL}/habits/completed", headers=headers)
    assert response.status_code == 200, f"Failed to get completed habits: {response.status_code} - {response.text}"
    
    completed_habits = response.json()
    print(f"Completed habits: {len(completed_habits)}")
    
    completed_habit = next((h for h in completed_habits if h['id'] == habit_id), None)
    assert completed_habit is not None, "Habit not found in completed list"
    assert completed_habit.get('completed') == True, f"Habit completion status is {completed_habit.get('completed')}, expected True"
    
    print("✅ SUCCESS: Habit completion is working correctly!")
    print(f"Completed habit: {completed_habit['name']} (completed: {completed_habit.get('completed')})")

if __name__ == "__main__":
    test_complete_functionality() 