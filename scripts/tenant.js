import { db } from './firebaseConfig.js';
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('maintenanceRequestForm');

    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const request = {
                apartment: document.getElementById('apartment').value,
                area: document.getElementById('area').value,
                description: document.getElementById('description').value,
                status: 'pending',
                dateTime: new Date().getTime(),
                photoUrl: document.getElementById('photo').value
            };

            try {
                const requestsCollection = collection(db, 'requests');
                await addDoc(requestsCollection, request);
                alert('Maintenance request submitted successfully!');
                form.reset();
            } catch (error) {
                console.error('Error adding document: ', error);
                alert('Failed to submit request.');
            }
        });
    }
});


