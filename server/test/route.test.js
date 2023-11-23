const request = require('supertest');
const { expect } = require('chai');
const app = require('../server'); 
const mongoose = require('mongoose') 
const validObjectId = new mongoose.Types.ObjectId();

// Test suite pour les routes
describe('Tests pour les routes de l\'API', () => {
  // Test pour la route '/getTodoList'
  it('Devrait retourner un code 200 et une liste de tâches', (done) => {
    request(app)
      .get('/getTodoList')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array'); 
        done();
      });
  });

  // Test pour la route '/addTodoList'
  it('Devrait ajouter une nouvelle tâche', (done) => {
    const newTask = {
      task: 'Nouvelle tâche',
      status: 'À faire',
      deadline: '2023-12-31' 
    };

    request(app)
      .post('/addTodoList')
      .send(newTask)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('_id'); 
        expect(res.body.task).to.equal(newTask.task);
        done();
      });
  });

// Test pour la route '/updateTodoList/:id'
it('Devrait mettre à jour une tâche existante', (done) => {
  const taskId = validObjectId; // Remplacez par l'ID réel d'une tâche existante dans votre base de données
  const updatedTask = {
    task: 'Tâche mise à jour',
    status: 'En cours',
    deadline: '2023-12-15'
  };

  request(app)
    .post(`/updateTodoList/${taskId}`)
    .send(updatedTask)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      console.log(JSON.stringify(res.body, null, 2) + " body")
      if (res.body !== null) {
        expect(res.body.task).to.equal(updatedTask.task);
        expect(res.body.status).to.equal(updatedTask.status);
        expect(res.body.deadline).to.equal(updatedTask.deadline);
        // Ajoutez d'autres assertions si nécessaire
      } else {
        console.error('La réponse est null.');
      }

      done();
    });
});


// Test pour la route '/deleteTodoList/:id'
it('Devrait supprimer une tâche existante', (done) => {
  const taskId = validObjectId; // Remplacez par l'ID réel d'une tâche existante dans votre base de données

  request(app)
    .delete(`/deleteTodoList/${taskId}`)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);

      // Vérifie si la réponse (res.body) est vide/null
      expect(res.body).to.be.null; // ou expect(res.body).to.be.undefined;

      // Vous pouvez également ajouter d'autres assertions spécifiques à la suppression réussie

      done();
    });
});

})