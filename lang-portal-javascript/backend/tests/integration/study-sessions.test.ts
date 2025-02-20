import request from 'supertest';
import { app } from '../../src/server';
import { describe, it, expect } from 'bun:test';

describe('Study Sessions API Integration Tests', () => {
  const testData = {
    sessionId: 1,
    wordId: 1
  };

  it('should get all study sessions with pagination', async () => {
    const res = await request(app).get('/api/study_sessions');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items[0]).toHaveProperty('id');
    expect(res.body.items[0]).toHaveProperty('activity_name');
    expect(res.body.items[0]).toHaveProperty('group_name');
    expect(res.body.items[0]).toHaveProperty('start_time');
    expect(res.body.items[0]).toHaveProperty('end_time');
    expect(res.body.items[0]).toHaveProperty('review_items_count');

    // Check pagination
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination).toHaveProperty('current_page');
    expect(res.body.pagination).toHaveProperty('total_pages');
    expect(res.body.pagination).toHaveProperty('total_items');
    expect(res.body.pagination).toHaveProperty('items_per_page', 100);
  });

  it('should get a specific study session', async () => {
    const res = await request(app).get(`/api/study_sessions/${testData.sessionId}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', testData.sessionId);
    expect(res.body).toHaveProperty('activity_name');
    expect(res.body).toHaveProperty('group_name');
    expect(res.body).toHaveProperty('start_time');
    expect(res.body).toHaveProperty('end_time');
    expect(res.body).toHaveProperty('review_items_count');
  });

  it('should get words for a study session with pagination', async () => {
    const res = await request(app).get(`/api/study_sessions/${testData.sessionId}/words`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items[0]).toHaveProperty('german');
    expect(res.body.items[0]).toHaveProperty('phonetics');
    expect(res.body.items[0]).toHaveProperty('english');
    expect(res.body.items[0]).toHaveProperty('correct_count');
    expect(res.body.items[0]).toHaveProperty('wrong_count');

    // Check pagination
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination).toHaveProperty('current_page');
    expect(res.body.pagination).toHaveProperty('total_pages');
    expect(res.body.pagination).toHaveProperty('total_items');
    expect(res.body.pagination).toHaveProperty('items_per_page', 100);
  });

  it('should review a word in a study session', async () => {
    const res = await request(app)
      .post(`/api/study_sessions/${testData.sessionId}/words/${testData.wordId}/review`)
      .send({ correct: true });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});
