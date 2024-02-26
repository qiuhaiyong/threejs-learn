import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// 容器构建
const canvas = document.querySelector(".webgl");
// 初始化渲染器
const render = new THREE.WebGLRenderer({ canvas: canvas });
render.setSize(sizes.width, sizes.height);
render.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 初始化场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);
scene.fog = new THREE.Fog(0x1a1a1a, 1, 1000);

// 初始化相机
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height);
camera.position.set(30, 100, 450);
scene.add(camera);

// 初始化控制器
const controls = new OrbitControls(camera, render.domElement);
controls.enableDamping = true;

// 添加光源
const light = new THREE.AmbientLight(0xdeedff, 1.5);
scene.add(light);

// 创建星球
const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
const meshLambertMaterial = new THREE.MeshLambertMaterial({
  color: 0x03c03c,
  wireframe: true,
});
const planet = new THREE.Mesh(sphereGeometry, meshLambertMaterial);
scene.add(planet);

// 创建星球轨道环
const torusGeometry = new THREE.TorusGeometry(100, 8, 2, 120);
const tourMaterial = new THREE.MeshLambertMaterial({
  color: 0x40a9ff,
  wireframe: true,
});
const ring = new THREE.Mesh(torusGeometry, tourMaterial);
ring.rotation.x = Math.PI / 2;
ring.rotation.y = -0.1 * (Math.PI / 2);
scene.add(ring);

// 创建卫星
const icoGeometry = new THREE.IcosahedronGeometry(10, 0);
const icoMaterial = new THREE.MeshToonMaterial({ color: 0xfffc00 });
const satellite = new THREE.Mesh(icoGeometry, icoMaterial);
satellite.position.set(0, 0, 0);
scene.add(satellite);

// 星星
const stars = new THREE.Group();
for (let i = 0; i < 500; i++) {
  const geometry = new THREE.IcosahedronGeometry(Math.random() * 2, 0);
  const material = new THREE.MeshToonMaterial({ color: 0xeeeeee });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 700;
  mesh.position.y = (Math.random() - 0.5) * 700;
  mesh.position.z = (Math.random() - 0.5) * 700;
  mesh.rotation.x = Math.random() * 2 * Math.PI;
  mesh.rotation.y = Math.random() * 2 * Math.PI;
  mesh.rotation.z = Math.random() * 2 * Math.PI;
  stars.add(mesh);
}
scene.add(stars);

// 页面缩放监听
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // 更新渲染
  render.setSize(sizes.width, sizes.height);
  render.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 更新相机
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

let rot = 0;
const axis = new THREE.Vector3(0, 0, 1);
const tick = () => {
  render.render(scene, camera);
  // 星球自转
  planet && (planet.rotation.y += 0.005);

  // 轨道
  ring && ring.rotateOnAxis(axis, Math.PI / 400);

  // 卫星位置动画
  rot += Math.random() * 0.8;
  const radian = (rot * Math.PI) / 180;
  satellite.position.x = 250 * Math.sin(radian);
  satellite.position.y = 100 * Math.cos(radian);
  satellite.position.z = -100 * Math.cos(radian);
  satellite.rotation.x += 0.005;
  satellite.rotation.y += 0.005;
  satellite.rotation.z -= 0.005;

  stars.rotation.x += 0.0009;
  stars.rotation.y += 0.0003;
  // 更新自身控制器
  controls.update();
  window.requestAnimationFrame(tick);
};
tick();
