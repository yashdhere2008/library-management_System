<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Library System</title>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
    }

    body {
        height: 100vh;
        background: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f') no-repeat center center/cover;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login-box {
        width: 350px;
        padding: 30px;
        background: rgba(0,0,0,0.7);
        border-radius: 15px;
        color: white;
        text-align: center;
        backdrop-filter: blur(8px);
    }

    h2 {
        margin-bottom: 5px;
    }

    .subtitle {
        color: #ccc;
        font-size: 14px;
        margin-bottom: 20px;
    }

    .input-box {
        margin: 20px 0;
        text-align: left;
    }

    select, input {
        width: 100%;
        padding: 10px;
        background: transparent;
        border: none;
        border-bottom: 2px solid cyan;
        color: white;
        outline: none;
        font-size: 16px;
    }

    select option {
        color: black;
    }

    button {
        width: 100%;
        padding: 12px;
        background: cyan;
        border: none;
        border-radius: 25px;
        font-size: 18px;
        cursor: pointer;
        margin-top: 10px;
    }

    button:hover {
        background: #00bcd4;
    }

    .message {
        margin-top: 15px;
        color: lightgreen;
        font-weight: bold;
    }
</style>
</head>

<body>

<div class="login-box">
    <h2>Welcome to the Library System</h2>
    <p class="subtitle">Login to continue...</p>

    <div class="input-box">
        <select id="role">
            <option value="">Select Role</option>
            <option>Student</option>
            <option>Admin</option>
            <option>Librarian</option>
        </select>
    </div>

    <div class="input-box">
        <input type="text" id="username" placeholder="Username">
    </div>

    <div class="input-box">
        <input type="password" id="password" placeholder="Password">
    </div>

    <button onclick="login()">Login</button>

    <div class="message" id="msg"></div>
</div>

<script>
function login() {
    let role = document.getElementById("role").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if(role === "" || username === "" || password === "") {
        document.getElementById("msg").innerHTML = "⚠ Please fill all fields!";
    } else {
        document.getElementById("msg").innerHTML =
            "✅ Login Successful as " + role + "!";
    }
}
</script>

</body>
</html>