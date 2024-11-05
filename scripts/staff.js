import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {db} from "./firebaseConfig.js";

async function fetchRequests(filterApt, filterArea, filterStatus, filterStart, filterEnd) {


    try {
        let q = collection(db, 'requests')
        if(filterApt) q = query(q, where("apartment", "==", filterApt))
        if(filterArea) q = query(q, where("area", "==", filterArea))
        if(filterStatus !== "all") q = query(q, where("status", "==", filterStatus))
        if(filterStart !== "" && filterEnd !== "") {
            let newStart = new Date(filterStart).getTime()
            let newEnd = new Date(filterEnd).getTime()
            q = query(q, where("dateTime", ">=", newStart))
            q = query (q, where("dateTime", "<=", newEnd))
        }
        const requestSnapshot = await getDocs(q)
        const requestsList = requestSnapshot.docs.map(doc =>({
            id: doc.id,
            ...doc.data()
        }))
        console.log("Fetched requests", requestsList);
        return requestsList;
    } catch(e){
        console.error("Error fetching tenants: ", e);
    }
}
function renderRequestsList(requests) {
    const requestsList = document.getElementById('requestsList');
    requestsList.innerHTML = '';
    requests.forEach(request => {
        const requestDiv = document.createElement('div');
        requestDiv.classList.add('user-card');
        const date = new Date(request.dateTime).toLocaleString();
        const photoUrl = request.photoUrl

        requestDiv.innerHTML = `
            <h3>Apartment Number: ${request.apartment}</h3>
            <p>Area: ${request.area}</p>
            <p>Time: ${date}</p>
            <p>Description: ${request.description}</p>
            <p>Status: ${request.status}</p>
            ${photoUrl ? `<img src="${photoUrl}" alt="Request photo">` : ''}
            <button class="edit-button" data-id="${request.id}">Edit Status</button>
        `;

        requestsList.appendChild(requestDiv);
    });
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (e) => openEditModal(e.target.dataset.id));
    });
}
async function openEditModal(requestId) {
    try {
        const requestDoc = await getDoc(doc(db, 'requests', requestId));
        if (requestDoc.exists()) {
            const request = requestDoc.data();

            // Populate the apartment number field
            document.getElementById('editUserId').value = requestId;
            document.getElementById('editStatus').value = request.status;

            // Show the modal
            document.getElementById('editStatusModal').style.display = 'block';
        }
    } catch (error) {
        console.error("Error fetching tenant:", error);
    }
}
document.getElementById('editStatusForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const requestId = document.getElementById('editUserId').value;
    const updatedStatus = document.getElementById('editStatus').value;

    try {
        // Update only the apartment field in Firestore
        await updateDoc(doc(db, 'requests', requestId), { status: updatedStatus });
        alert("Status updated successfully!");
        closeModal();

        // Refresh the list after updating
        const tenants = await fetchRequests();
        renderRequestsList(tenants);
        location.reload();
    } catch (error) {
        console.error("Error updating Status:", error);
    }
});
function closeModal() {
    document.getElementById('editStatusModal').style.display = 'none';
}

async function renderFilters(){

    const filterApt = document.getElementById("filterApartment").value
    const filterArea = document.getElementById("filterArea").value
    const filterStatus = document.getElementById("filterStatus").value
    const filterStart = document.getElementById("dateStart").value
    const filterEnd = document.getElementById("dateEnd").value
    console.log(filterStart)
    const requests = await fetchRequests(filterApt, filterArea, filterStatus, filterStart, filterEnd);
    renderRequestsList(requests);
}

document.addEventListener('DOMContentLoaded', async function () {
    console.log("he")
    const requests = await fetchRequests("", "", "all", "", "");
    renderRequestsList(requests);
})
window.closeModal = closeModal;
window.renderFilters = renderFilters;


