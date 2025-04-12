<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Become a Member | mymedicalcabinet.com</title>
        <link rel="stylesheet" href="css/become-a-member.css">
        <link rel="stylesheet" href="css/responsive.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    </head>

    <body class="body-main">
        <header class="header-main">
            <div class="grid-container">
            <div class="grid-logo">
                <a href="index.html"><img class="logo" src="images/mymed100by50logo.png" alt="logo"></a>
            </div>
            <div class="grid-burger">
                
                <!-- Mobile Menu Start -->
                  <nav>
                    <ul class="sidebar">
                        <li class="sidebar-close-btn">
                          <a href="#"><img src="images/closeicon.svg" alt="close icon"></a>
                        </li>
                        <li><a href="login.html">Login</a></li>
                        <li><a href="mydashboard.html">My Dashboard</a></li>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="about-us.html">About Us</a></li>
                        <li><a href="become-a-member.html">Become a Member</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                    </ul>
                    <ul class="nav-list">
                        <li class="menu-button burger-menu-btn">
                            <a href="#"><img src="images/menu.png" alt="hamburger menu"></a>
                        </li>
                    </ul>
                </nav>
            <!-- Mobile Menu End -->

            </div>
            </div>
        </header>
        <div class="main">
            <div class="container">
                <section class="hero">
                    <div class="hero-section"><h1>Become a Member</h1>
                    <h2>Safe and Secure Storage for all your medical records</h2>
                    </div>
                </section>

                <div class="account-container">
                    <h2>Get Started</h2>
                    <form id="signup-form" class="account-form">
                        <div>
                            <label for="name">Full Name</label>
                            <input type="text" id="name" name="name" placeholder="Full Name" required>
                        </div>
                        
                        <div>
                            <label for="username">Username</label>
                            <input type="text" id="username" name="username" placeholder="Username" required>
                        </div>

                        <div>
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="Enter Email" required>
                        </div>
                        <div>
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit">Sign Up</button>
                        <p id="message" class="message"></p>
                    </form>
                </div>

                <div>
                    <section class="grid-section1">
                        <div class="grid-card1">
                            <h2>What We Do</h2>
                            <p>MyMedicalCabinet.com is a secure, easy-to-use platform designed to help users store, manage, and access their medical records, history, medications, and doctor information—all in one place.</p>
                            <button class="grid-card-btn">Learn More</button>
                        </div>
                        <div class="grid-card2">
                            <h2>Free to sign up</h2>
                            <p>It's free and always will be.</p>
                            <a href="become-a-member.html" class="grid-card-btn">Join Today</a>
                        </div>
                        <div class="grid-card3">
                            <h2>How we Help</h2>
                            <p>We simplify health record management by providing a centralized digital cabinet where users can track their medical history, prescriptions, upcoming appointments, and doctor details. No more searching for paperwork—your health data is always at your fingertips.</p>
                            <button class="grid-card-btn">Learn More</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        <script src="/js/becomeamember.js"></script>
        <script src="/js/menu.js"></script>
    </body>
    
</html>
