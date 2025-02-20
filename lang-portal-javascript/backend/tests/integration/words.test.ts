// import request from 'supertest';
// import { app } from '../../src/server';
// import { describe, it, expect } from 'bun:test';

// describe('Words API Integration Tests', () => {
//   const testWord = {
//     id: 1,
//     german: 'Hallo',
//     phonetic: 'ha-lo',
//     english: 'hello',
//     parts: { part: 'greeting' }
//   };

//   it('should create a new word', async () => {
//     const res = await request(app)
//       .post('/api/words')
//       .send({
//         german: testWord.german,
//         phonetic: testWord.phonetic,
//         english: testWord.english,
//         parts: testWord.parts
//       });

//     expect(res.status).toBe(201);
//     expect(res.body).toHaveProperty('id');
//     expect(res.body).toHaveProperty('german', testWord.german);
//     expect(res.body).toHaveProperty('phonetic', testWord.phonetic);
//     expect(res.body).toHaveProperty('english', testWord.english);
//     expect(res.body).toHaveProperty('parts');
//   });

//   it('should get all words', async () => {
//     const res = await request(app).get('/api/words');
    
//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//     expect(res.body[0]).toHaveProperty('id');
//     expect(res.body[0]).toHaveProperty('german');
//     expect(res.body[0]).toHaveProperty('english');
//   });

//   it('should get a specific word', async () => {
//     const res = await request(app).get(`/api/words/${testWord.id}`);
    
//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty('id', testWord.id);
//     expect(res.body).toHaveProperty('german', testWord.german);
//     expect(res.body).toHaveProperty('english', testWord.english);
//   });

//   it('should return 404 for non-existent word', async () => {
//     const res = await request(app).get('/api/words/999');
//     expect(res.status).toBe(404);
//   });

//   it('should update a word', async () => {
//     const updatedGerman = 'Tschüss';
//     const res = await request(app)
//       .put(`/api/words/${testWord.id}`)
//       .send({ german: updatedGerman });

//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty('id', testWord.id);
//     expect(res.body).toHaveProperty('german', updatedGerman);
//   });

//   it('should delete a word', async () => {
//     const res = await request(app).delete(`/api/words/${testWord.id}`);
//     expect(res.status).toBe(204);
//   });
// });
