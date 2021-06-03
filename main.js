import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(5, 0.25, 15, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// helpers: they show you stuff like where the light is positioned, and a mesh grid thingy

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 5)
// scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.OctahedronGeometry(0.5);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
// populates 200 stars randomly on the screen
Array(200).fill().forEach(addStar);

// set the scene background
const bgGradient = new THREE.TextureLoader().load("./static/gradient.png");
scene.background = bgGradient;

// texture mapping cmd-tech logo onto a plane

const logoTexture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/Command-Tech/CommandTech/master/assets/img/logo.png"
);

const logo = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshBasicMaterial({ map: logoTexture })
);

scene.add(logo);

// texture map a web globe thing onto a spheere

const globeTexture = new THREE.TextureLoader().load("./static/earth.jpg");

const globe = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: globeTexture,
  })
);

scene.add(globe);

globe.position.z = 5;
globe.position.setX(-10);
globe.position.setY(-5);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  globe.rotation.x += 0.05;
  globe.rotation.y += 0.05;
  globe.rotation.z += 0.01;

  camera.position.z = t * -0.01;
}

document.body.onscroll = moveCamera;

// animates the torus object so it rotates

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  controls.update();

  renderer.render(scene, camera);
}

animate();
