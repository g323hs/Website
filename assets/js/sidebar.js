function createSidebar(relative) {
    const sidebarHTML = `
    <!-- Sidebar -->
    <div id="sidebar">
        <div class="inner">
            <!-- Menu -->
            <nav id="menu">
                <header class="major">
                    <h2>Menu</h2>
                </header>
                <ul>
                    <li><a href="${relative}/website/index.html">Homepage</a></li>
                    <!-- <li><a href="${relative}/website/elements.html">Elements</a></li> -->
                    <li>
                        <span class="opener">Projects</span>
                        <ul>
                            <li><a href="${relative}/website/projects/perlin/perlin.html">Perlin Noise</a></li>
                            <li><a href="${relative}/website/#">Path Finding</a></li>
                            <li><a href="${relative}/website/projects/alevel/alevel.html" target="_blank">A-Level Project</a></li>
                        </ul> 
                    </li>
                    <li><a href="${relative}/website/cv/cv.html">CV</a></li>
                </ul>
            </nav>

            <!-- Section -->
            <section>
                <header class="major">
                    <h2>Get in touch</h2>
                </header>
                <p>If you have any questions or feedback about any of my projects or would like to get in touch, please don't hesitate to email me or send me a message. Thanks!</p>
                <ul class="contact">
                    <li class="icon solid fa-phone">(+44) 7507066055</li>
                    <li class="icon solid fa-envelope"><a href="mailto:3ghildicksmith3@gmail.com">3ghildicksmith3@gmail.com</a></li>
                </ul>
            </section>

            <!-- Footer -->
            <footer id="footer">
                <p class="copyright">&copy; 2024 George Hildick-Smith. All rights reserved.</p>
            </footer>
        </div>
    </div>`;
    // Insert the HTML directly after the script where this function is executed
    const scriptTag = document.currentScript;
    scriptTag.insertAdjacentHTML('afterend', sidebarHTML);
}