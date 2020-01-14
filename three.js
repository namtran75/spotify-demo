import * as THREE from './node_modules/three/build/three.module.js';
import { GeometryUtils } from './node_modules/three/examples/jsm/utils/GeometryUtils.js';
var mouseX = 0,
    mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var camera, scene, renderer;
init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(33, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    //
    var hilbertPoints = GeometryUtils.hilbert3D(new THREE.Vector3(0, 0, 0), 200.0, 1, 0, 1, 2, 3, 4, 5, 6, 7);
    var geometry1 = new THREE.BufferGeometry();
    var geometry2 = new THREE.BufferGeometry();
    var geometry3 = new THREE.BufferGeometry();
    var subdivisions = 6;
    var vertices = [];
    var colors1 = [];
    var colors2 = [];
    var colors3 = [];
    var point = new THREE.Vector3();
    var color = new THREE.Color();
    var spline = new THREE.CatmullRomCurve3(hilbertPoints);
    for (var i = 0; i < hilbertPoints.length * subdivisions; i++) {
        var t = i / (hilbertPoints.length * subdivisions);
        spline.getPoint(t, point);
        vertices.push(point.x, point.y, point.z);
        color.setHSL(0.6, 1.0, Math.max(0, -point.x / 200) + 0.5);
        colors1.push(color.r, color.g, color.b);

        color.setHSL(0.3, 1.0, Math.max(0, -point.y / 200) + 0.5);
        colors2.push(color.r, color.g, color.b);
        color.setHSL(i / (hilbertPoints.length * subdivisions), 1.0, 0.5);
        colors3.push(color.r, color.g, color.b);


    }

    geometry2.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry3.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry2.setAttribute('color', new THREE.Float32BufferAttribute(colors2, 3));

    geometry3.setAttribute('color', new THREE.Float32BufferAttribute(colors3, 3));
    //
    var geometry4 = new THREE.BufferGeometry();
    var geometry5 = new THREE.BufferGeometry();
    var geometry6 = new THREE.BufferGeometry();
    vertices = [];
    colors1 = [];
    colors2 = [];
    colors3 = [];
    for (var i = 0; i < hilbertPoints.length; i++) {
        var point = hilbertPoints[i];
        vertices.push(point.x, point.y, point.z);
        color.setHSL(0.6, 1.0, Math.max(0, (200 - hilbertPoints[i].x) / 400) * 0.5 + 0.5);
        colors1.push(color.r, color.g, color.b);
        color.setHSL(0.3, 1.0, Math.max(0, (200 + hilbertPoints[i].x) / 400) * 0.5);
        colors2.push(color.r, color.g, color.b);
        color.setHSL(i / hilbertPoints.length, 1.0, 0.5);
        colors3.push(color.r, color.g, color.b);
    }

    geometry5.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry6.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    geometry5.setAttribute('color', new THREE.Float32BufferAttribute(colors2, 3));
    geometry6.setAttribute('color', new THREE.Float32BufferAttribute(colors3, 3));
    // Create lines and add to scene
    var material = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: THREE.VertexColors });
    var line, p, scale = 0.3,
        d = 225;
    var parameters = [
        [material, scale * 1.5, [-d, -d / 2, 0], geometry1],
        [material, scale * 1.5, [0, -d / 2, 0], geometry2],
        [material, scale * 1.5, [d, -d / 2, 0], geometry3],
        [material, scale * 1.5, [-d, d / 2, 0], geometry4],
        [material, scale * 1.5, [0, d / 2, 0], geometry5],
        [material, scale * 1.5, [d, d / 2, 0], geometry6],
    ];
    for (var i = 0; i < parameters.length; i++) {
        p = parameters[i];
        line = new THREE.Line(p[3], p[0]);
        line.scale.x = line.scale.y = line.scale.z = p[1];
        line.position.x = p[2][0];
        line.position.y = p[2][1];
        line.position.z = p[2][2];
        scene.add(line);
    }
    //
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    //
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
//
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}
//
function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY + 200 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    var time = Date.now() * 0.0005;
    for (var i = 0; i < scene.children.length; i++) {
        var object = scene.children[i];
        if (object.isLine) {
            object.rotation.y = time * (i % 2 ? 1 : -1);
        }
    }
    renderer.render(scene, camera);
}