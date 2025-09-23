#!/bin/bash

# Chat API Test Script using cURL
# Usage: ./scripts/test-chat-api-curl.sh

API_BASE_URL="http://localhost:3000"
USER_ID="test_user_$(date +%s)"
TOKEN_SLUG="xpl"

echo "🚀 Testing Chat API with cURL..."
echo "API Base URL: $API_BASE_URL"
echo "User ID: $USER_ID"
echo "Token Slug: $TOKEN_SLUG"
echo ""

# Test 1: Send chat message
echo "📤 Test 1: Sending chat message..."
curl -X POST "$API_BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"token_slug\": \"$TOKEN_SLUG\",
    \"question\": \"What is Plasma token and how does it work?\"
  }" \
  -w "\n\nStatus: %{http_code}\n" \
  -s

echo ""

# Wait a moment
sleep 1

# Test 2: Get chat history
echo "📥 Test 2: Getting chat history..."
curl -X GET "$API_BASE_URL/api/chat/history/$USER_ID/$TOKEN_SLUG?limit=10" \
  -H "Content-Type: application/json" \
  -w "\n\nStatus: %{http_code}\n" \
  -s

echo ""

# Wait a moment
sleep 1

# Test 3: Send another message
echo "📤 Test 3: Sending another message..."
curl -X POST "$API_BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"token_slug\": \"$TOKEN_SLUG\",
    \"question\": \"What is the current price of XPL token?\"
  }" \
  -w "\n\nStatus: %{http_code}\n" \
  -s

echo ""

# Wait a moment
sleep 1

# Test 4: Get updated history
echo "📥 Test 4: Getting updated history..."
curl -X GET "$API_BASE_URL/api/chat/history/$USER_ID/$TOKEN_SLUG?limit=10" \
  -H "Content-Type: application/json" \
  -w "\n\nStatus: %{http_code}\n" \
  -s

echo ""

# Test 5: Error handling - Invalid data
echo "🧪 Test 5: Testing error handling with invalid data..."
curl -X POST "$API_BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d "{
    \"invalid_field\": \"test\"
  }" \
  -w "\n\nStatus: %{http_code}\n" \
  -s

echo ""
echo "🎉 Chat API test completed!"

# Test with different token
echo ""
echo "🔄 Testing with different token (BTC)..."
curl -X POST "$API_BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"token_slug\": \"btc\",
    \"question\": \"What is Bitcoin and how does it work?\"
  }" \
  -w "\n\nStatus: %{http_code}\n" \
  -s

echo ""
echo "✨ All tests completed!"
