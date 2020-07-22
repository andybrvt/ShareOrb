// <div className = "profileCard">
//   <div className = 'image-box'>
//   <img className = 'profile-image' src = {ava2} alt = 'Avatar'/>
//   </div>
//   <div className = 'bottom'>
//     <div className = 'btn'>
//       <div
//       onClick = {() => this.onClickToggle()}
//       className = 'btn-text'><span>More</span><span>Close</
//       span>
//       </div>
//     </div>
//     <div className = 'name'>{this.props.data.username}</div>
//     <div className = 'designation'>Web developer </div>
//   </div>
//   <div className = 'social'>
//     <p>Follow me</p>
//     <div className = 'social-links'>
//       <a href = 'https://facebook.com/username'>
//         <img src = {facebook} alt = 'Facebook' />
//       </a>
//       <a href = 'https://twitter.com/username'>
//         <img src = {twitter} alt = 'Facebook' />
//       </a>
//       <a href = 'https://instagram.com/username'>
//         <img src = {instagram} alt = 'Facebook' />
//       </a>
//     </div>
//     <a className = 'email' href = 'email'>Email</a>
//   </div>
// </div>


// .profileCard{
//   background-color: white;
//   width: 300px;
//   height: 470px;
//   border-radius: 25px;
//   display: grid;
//   grid-template-rows: auto 100px;
//   box-shadow: 0 20px 30px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24);
//   position: relative;
//   overflow: hidden;
//
// }
//
// .image-box{
//   width: 300px;
//   position: relative;
//   text-align: center;
//   /* overflow:hidden; */
//   /* background-color: red; */
// }
//
// .profile-image {
//   position: absolute;
//   /* width: 320px; */
//   height: 100%;
//   left: 50%;
//   transform: translateX(-50%);
//   transition: 0.5s;
// }
//
//
// .name {
//   font-weight: bold;
//   font-size: 26px;
//   line-height: 26px;
//   z-index: 1;
// }
//
// .bottom {
//   display: grid;
//   justify-content: center;
//   align-content: center;
//   text-align: center;
//   width: 300px;
//   position: relative;
//   color: #363636;
// }
//
// .designation{
//   margin-top: 5px;
//   font-size: 18px;
//   line-height: 14px;
//   z-index: 1;
//   transition: 0.5s;
// }
//
// .btn{
//   padding-top: 8px;
//   position: absolute;
//   width: 105px;
//   height: 38px;
//   background: lightblue;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   border-radius: 25px;
//   color: #fff;
//   cursor: pointer;
//   user-select: none;
//   overflow: hidden;
//   z-index: 2;
//   transition: 0.5s;
// }
//
// .btn-text{
//   height: 100%;
//   display:grid;
//   /* 1fr and 1fr seperates the text */
//   grid-template-rows: 1fr 1fr;
//   grid-row-gap: 9px;
//   transition: 0.5s;
// }
//
// .social {
//   padding: 20px;
//   position: absolute;
//   background-color: transparent;
//   top: -100%;
//   left:0;
//   height: 100%;
//   width: 100%;
//   color: #fff;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   z-index: 0;
//   transition: 0.5s;
// }
//
// .social p {
//   margin-top: 50px;
//   border: 1px solid #fff;
//   height: fit-content;
//   padding: 0 10px;
//   border-radius: 20px;
// }
//
// .social-links {
//   margin-top: 20px;
//   width: 100%;
//   padding: 10px 30px;
//   display: flex;
//   justify-content: space-between;
// }
//
// .social-links a {
//   transition: 0.2s;
// }
//
// a:hover {
//   transform: translateY(-5px)
// }
//
// .social-links img {
//   width: 45px;
// }
//
// .email {
//   width: 100px;
//   height: 40px;
//   text-decoration: none;
//   border: 1px solid #fff;
//   border-radius: 8px;
//   color: #fff;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   transition: 0.2s;
// }
//
// .profileCard.active .name, .profileCard.active .designation{
//   transform: translateY(-310px);
//   color: #fff;
// }
//
// .profileCard.active .btn {
//   transform: translate(-50%, 30px);
// }
//
// .profileCard.active .email{
//   width: 200px;
//   background-color: #ffffff40;
// }
//
// .profileCard.active .profile-image{
//   height: 470px;
// }
//
// .profileCard.active .btn-text {
//   transform: translateY(-30px);
// }
//
// .profileCard.active .social {
//   top: 0;
//   background-color: #000000cc;
// }
