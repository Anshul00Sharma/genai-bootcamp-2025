import request from 'supertest';
import { app } from '../../src/server';
import { describe, it, expect } from 'bun:test';

describe('Groups API Integration Tests', () => {
  const testGroup = {
    id: 1,
    name: 'Test Group'
  };

  it('should get all groups with pagination', async () => {
    const res = await request(app).get('/api/groups');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items[0]).toHaveProperty('id');
    expect(res.body.items[0]).toHaveProperty('name');
    expect(res.body.items[0]).toHaveProperty('word_count');
    
    // Check pagination
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination).toHaveProperty('current_page');
    expect(res.body.pagination).toHaveProperty('total_pages');
    expect(res.body.pagination).toHaveProperty('total_items');
    expect(res.body.pagination).toHaveProperty('items_per_page', 100);
  });

  it('should get a specific group with stats', async () => {
    const res = await request(app).get(`/api/groups/${testGroup.id}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', testGroup.id);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('stats');
    expect(res.body.stats).toHaveProperty('total_word_count');
  });

  it('should get words for a group with pagination', async () => {
    const res = await request(app).get(`/api/groups/${testGroup.id}/words`);
    
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

  it('should get study sessions for a group with pagination', async () => {
    const res = await request(app).get(`/api/groups/${testGroup.id}/study_sessions`);
    
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
});
