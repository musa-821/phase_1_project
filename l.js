// GET the appointment form from HTML
const appointmentForm = document.getElementById("appointmentForm"); 


appointmentForm.addEventListener("submit", function(event) {

    // Prevent the page from refreshing immediately
    event.preventDefault();

    // Collect data entered in the form
    const appointment = {
        fullName: document.getElementById("fullName").value,
        phone: document.getElementById("phone").value,
        department: document.getElementById("department").value,
        doctor: document.getElementById("doctor").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        reason: document.getElementById("reason").value
    };

    // Send the new appointment to JSON Server
    fetch("http://localhost:3000/appointments", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(appointment)
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Failed to save appointment");
        }

        return response.json();
    })
    .then(function() {
        // Refresh the page to show the new appointment
        location.reload();
    })
    .catch(function(error) {
        console.error(error);
        alert("Could not save appointment. Check JSON Server.");
    });

});



fetch("http://localhost:3000/appointments")
.then(function(response) {
    return response.json();
})
.then(function(data) {

    // Find the div that displays appointments
    const appointmentsDiv =
        document.getElementById("appointments");

    // Clear the old display
    appointmentsDiv.innerHTML = "";

    // Go through every appointment
    data.forEach(function(appointment) {

        // Create a card for each appointment
        const appointmentDiv = document.createElement("div");

        appointmentDiv.className = "appointment-card";

        // Display appointment information
        // This helper also handles old records containing objects.
        function displayValue(value) {
            if (value && typeof value === "object") {
                return value.name || value.value || "";
            }

            return value ?? "";
        }

        appointmentDiv.innerHTML =
            "Name: " + displayValue(appointment.fullName) + "<br>" +
            "Phone: " + displayValue(appointment.phone) + "<br>" +
            "Department: " + displayValue(appointment.department) + "<br>" +
            "Doctor: " + displayValue(appointment.doctor) + "<br>" +
            "Date: " + displayValue(appointment.date) + "<br>" +
            "Time: " + displayValue(appointment.time) + "<br>" +
            "Reason: " + displayValue(appointment.reason) + "<br><br>";


        // ====================================
        // 3. EDIT AN APPOINTMENT (UPDATE)
        // ====================================

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        appointmentDiv.appendChild(editButton);

        editButton.addEventListener("click", function() {

            // Ask the user for the updated information
            const fullName = prompt(
                "Edit name:",
                displayValue(appointment.fullName)
            );

            if (fullName === null) return;

            const phone = prompt(
                "Edit phone:",
                displayValue(appointment.phone)
            );

            if (phone === null) return;

            const date = prompt(
                "Edit date (YYYY-MM-DD):",
                displayValue(appointment.date)
            );

            if (date === null) return;

            const reason = prompt(
                "Edit reason:",
                displayValue(appointment.reason)
            );

            if (reason === null) return;

            // Update the existing appointment using PUT
            fetch(
                "http://localhost:3000/appointments/" + appointment.id,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        fullName: fullName,
                        phone: phone,
                        department: displayValue(appointment.department),
                        doctor: displayValue(appointment.doctor),
                        date: date,
                        time: displayValue(appointment.time),
                        reason: reason
                    })
                }
            )
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("Failed to update appointment");
                }

                location.reload();
            })
            .catch(function(error) {
                console.error(error);
                alert("Could not update appointment.");
            });

        });


    
    
        // deletebutton

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        appointmentDiv.appendChild(deleteButton);

        deleteButton.addEventListener("click", function() {

            // Confirm before deleting
            if (!confirm("Are you sure you want to delete this appointment?")) {
                return;
            }

            // Delete the selected appointment
            fetch(
                "http://localhost:3000/appointments/" + appointment.id,
                {
                    method: "DELETE"
                }
            )
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("Failed to delete appointment");
                }

                location.reload();
            })
            .catch(function(error) {
                console.error(error);
                alert("Could not delete appointment.");
            });

        });


        // Add the completed card to the page
        appointmentsDiv.appendChild(appointmentDiv);

    });

})
.catch(function(error) {
    console.error(error);
    alert("Could not load appointments. Check JSON Server.");
});