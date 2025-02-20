import request from 'supertest';
import { app } from '../../src/server';
import { describe, it, expect } from 'bun:test';

describe('Study Activities API Integration Tests', () => {
  const testData = {
    groupId: 1,
    activityId: 1
  };

  it('should create a new study activity', async () => {
    const res = await request(app)
      .post('/api/study_activities')
      .send({ group_id: testData.groupId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('group_id', testData.groupId);
  });

  it('should get a specific study activity', async () => {
    const res = await request(app).get(`/api/study_activities/${testData.activityId}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', testData.activityId);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('thumbnail_url');
    expect(res.body).toHaveProperty('description');
  });

  it('should get study sessions for an activity with pagination', async () => {
    const res = await request(app).get(`/api/study_activities/${testData.activityId}/study_sessions`);
    
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
    expect(res.body.pagination).toHaveProperty('items_per_page', 20);
  });
});
