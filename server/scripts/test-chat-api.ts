#!/usr/bin/env ts-node

/**
 * Test script for Chat API
 * Usage: ts-node scripts/test-chat-api.ts
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Test data
const testData = {
  user_id: 'test_user_123456',
  token_slug: 'xpl',
  question: 'What is Plasma token and how does it work?'
};

async function testChatAPI() {
  console.log('🚀 Testing Chat API...\n');

  try {
    // Test 1: Send chat message
    console.log('📤 Test 1: Sending chat message...');
    const chatResponse = await axios.post(`${API_BASE_URL}/api/chat`, testData);
    
    console.log('✅ Chat Response:', {
      status: chatResponse.status,
      data: chatResponse.data
    });

    // Test 2: Get chat history
    console.log('\n📥 Test 2: Getting chat history...');
    const historyResponse = await axios.get(
      `${API_BASE_URL}/api/chat/history/${testData.user_id}/${testData.token_slug}?limit=10`
    );
    
    console.log('✅ History Response:', {
      status: historyResponse.status,
      data: historyResponse.data
    });

    // Test 3: Send another message
    console.log('\n📤 Test 3: Sending another message...');
    const secondMessage = {
      ...testData,
      question: 'What is the current price of XPL token?'
    };
    
    const secondResponse = await axios.post(`${API_BASE_URL}/api/chat`, secondMessage);
    
    console.log('✅ Second Chat Response:', {
      status: secondResponse.status,
      data: secondResponse.data
    });

    // Test 4: Get updated history
    console.log('\n📥 Test 4: Getting updated history...');
    const updatedHistoryResponse = await axios.get(
      `${API_BASE_URL}/api/chat/history/${testData.user_id}/${testData.token_slug}?limit=10`
    );
    
    console.log('✅ Updated History Response:', {
      status: updatedHistoryResponse.status,
      data: updatedHistoryResponse.data
    });

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Test error handling
async function testErrorHandling() {
  console.log('\n🧪 Testing error handling...\n');

  try {
    // Test with invalid data
    console.log('📤 Test: Sending invalid data...');
    const invalidResponse = await axios.post(`${API_BASE_URL}/api/chat`, {
      // Missing required fields
    });
    
    console.log('⚠️ Unexpected success with invalid data:', invalidResponse.data);

  } catch (error) {
    console.log('✅ Correctly handled invalid data:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
  }
}

// Main execution
async function main() {
  console.log('🔧 Chat API Test Suite');
  console.log('=====================\n');
  
  await testChatAPI();
  await testErrorHandling();
  
  console.log('\n✨ Test suite completed!');
}

if (require.main === module) {
  main().catch(console.error);
}
