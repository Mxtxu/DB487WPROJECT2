import { db } from './firebaseConfig.js';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('tenantForm');

    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const tenant = {
                name: document.getElementById('tenantName').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                checkInDate: document.getElementById('checkIn').value,
                checkOutDate: document.getElementById('checkOut').value,
                apartment: document.getElementById('apartment').value,
            };
            console.log(tenant)
            try {
                const tenantsCollection = collection(db, 'tenants');
                await addDoc(tenantsCollection, tenant);
                alert('Tenant added successfully!');
                location.reload()
                form.reset();
            } catch (error) {
                console.error('Error adding document: ', error);
                alert('Failed to add tenant.');
            }
            form.reset();
        });
    }
});
async function fetchTenants() {
    try {
        const tenantsCollection = collection(db, 'tenants');
        const tenantSnapshot = await getDocs(tenantsCollection);
        const tenantsList = tenantSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Fetched tenants:", tenantsList);
        return tenantsList;
    } catch (error) {
        console.error("Error fetching tenants:", error);
    }
}
function renderTenantsList(tenants) {
    const tenantsListContainer = document.getElementById('tenantList');

    tenants.forEach(tenant => {
        const tenantDiv = document.createElement('div');
        tenantDiv.classList.add('user-card');

        tenantDiv.innerHTML = `
            <h3>${tenant.name}</h3>
            <p>Email: ${tenant.email}</p>
            <p>Phone: ${tenant.phone}</p>
            <p>Check-in Date: ${tenant.checkInDate}</p>
            <p>Check-out Date: ${tenant.checkOutDate}</p>
            <p>Apartment Number: ${tenant.apartment}</p>
            <button class="edit-button" data-id="${tenant.id}">Edit Apartment</button>
            <button class="delete-button" data-id="${tenant.id}">Delete User</button>
        `;

        tenantsListContainer.appendChild(tenantDiv);
    });

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (e) => openEditModal(e.target.dataset.id));
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (e) => deleteUser(e.target.dataset.id));
    });
}

async function deleteUser(tenantId) {
    try {
        await deleteDoc(doc(db, 'tenants', tenantId));
        alert("User deleted successfully!");

        const tenants = await fetchTenants();
        renderTenantsList(tenants);
        location.reload();
    } catch (error) {
        console.error("Error deleting tenant:", error);
    }
}
async function openEditModal(tenantId) {
    try {
        const tenantDoc = await getDoc(doc(db, 'tenants', tenantId));
        if (tenantDoc.exists()) {
            const tenant = tenantDoc.data();

            // Populate the apartment number field
            document.getElementById('editUserId').value = tenantId;
            document.getElementById('editApartment').value = tenant.apartment;

            // Show the modal
            document.getElementById('editUserModal').style.display = 'block';
        }
    } catch (error) {
        console.error("Error fetching tenant:", error);
    }
}
function closeModal() {
    document.getElementById('editUserModal').style.display = 'none';
}
document.getElementById('editApartmentForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const tenantId = document.getElementById('editUserId').value;
    const updatedApartment = document.getElementById('editApartment').value;

    try {
        // Update only the apartment field in Firestore
        await updateDoc(doc(db, 'tenants', tenantId), { apartment: updatedApartment });
        alert("Apartment updated successfully!");
        closeModal();

        // Refresh the list after updating
        const tenants = await fetchTenants();
        renderTenantsList(tenants);
        location.reload();
    } catch (error) {
        console.error("Error updating apartment:", error);
    }
});

document.addEventListener('DOMContentLoaded', async function() {
    const tenants = await fetchTenants();
    renderTenantsList(tenants);
});

window.closeModal = closeModal