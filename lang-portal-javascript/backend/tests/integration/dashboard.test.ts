import request from 'supertest';
import { app } from '../../src/server';
import { describe, it, expect } from 'bun:test';

describe('Dashboard API Integration Tests', () => {
  it('should get last study session', async () => {
    const res = await request(app).get('/api/dashboard/last_study_session');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('group_id');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('study_activity_id');
    expect(res.body).toHaveProperty('group_name');
  });

  it('should get study progress', async () => {
    const res = await request(app).get('/api/dashboard/study_progress');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total_words_studied');
    expect(res.body).toHaveProperty('total_available_words');
  });

  it('should get quick stats', async () => {
    const res = await request(app).get('/api/dashboard/quick-stats');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success_rate');
    expect(res.body).toHaveProperty('total_study_sessions');
    expect(res.body).toHaveProperty('total_active_groups');
  });
});
