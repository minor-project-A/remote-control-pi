
document.addEventListener('DOMContentLoaded', function () {
    const dispenseButton = document.getElementById('dispenseButton');

    dispenseButton.addEventListener('click', async function () {
        try {
            const response = await fetch('http://localhost:3000/dispense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ container_index: 1 }), // Adjust the payload as needed
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
            } else {
                console.error('Failed to dispense medication:', response.status);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    });
});

