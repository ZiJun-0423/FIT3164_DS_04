import React from "react";
import './Footer.css';

const Footer = () =>{
    return (
        <div className="footer">
            <div className="sb_footer section_padding">
            <div className="sb_footer-links">
                <div className="sb_footer-links-div-1">
                    <h4>About</h4>
                    <a href= "/employer">
                        <p>About Us</p>
                    </a>
                    <a href= "/healthplan">
                        <p>Our Plan</p>
                    </a>
                    <a href= "/employer">
                        <p>Contact Us</p>
                    </a>
                </div>
                <div className="sb_footer-links-div-2">
                    <h4>Acknowledgments</h4>
                        <p>Developed by Team DS_04 as part of Monash University’s Capstone Project.</p>
                        <p>This website is a student project and not affiliated with any official football organization.</p>
                </div>
                <div className="sb_footer-links-div-2">
                    <p>In the spirit of reconciliation the AFL acknowledges the Traditional Custodians of country throughout Australia and their connections to land, sea and community. We pay our respect to their Elders past and present and extend that respect to all Aboriginal and Torres Strait Islander peoples today.</p>
                </div>       
            </div>

        <hr></hr>

        <div className="sb_footer-below">
            <div className="sb_footer-copyrights">
                <p>
                    @{new Date().getFullYear()} DS_04. All rights reserved.
                </p>
            </div>
            <div className="sb_footer-below-links">
                <a href= "/terms"><div><p>Terms & Conditions</p></div></a>
                <a href= "/privacy"><div><p>Privacy</p></div></a>
                <a href= "/security"><div><p>Security</p></div></a>
                <a href= "/cookie"><div><p>Cookie Declaration</p></div></a>
            </div>
        </div>

            </div>
        </div>

    )
}

export default Footer;