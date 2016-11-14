if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats, gui;
var camera, controls, scene, renderer;
var cross;
var ground;
var plywood,plywoodDark, errorPlywood, errorPlywoodDark;

var materialArray, errorMaterialArray;
var plywoodMaterial, errorPlywoodMaterial;

function initMaterials() {
  var loader = new THREE.TextureLoader();
  loader.load(
    // resource URL
    'images/plywood.jpg',
    // Function when resource is loaded
    function ( texture ) {
      plywood = new THREE.MeshPhongMaterial( {
        color: 0xffffff,
        map: texture,
        transparent: true
      });
      plywoodDark = new THREE.MeshPhongMaterial( {
        color: 0x261C0A,
        map: texture,
        transparent: true
      });
      materialArray = [ plywood, plywoodDark ];
      plywoodMaterial = new THREE.MeshFaceMaterial(materialArray);

      errorPlywood = new THREE.MeshPhongMaterial( {
        color: 0x440000,
        map: texture,
        transparent: true
      });
      errorPlywoodDark = new THREE.MeshPhongMaterial( {
        color: 0x330000,
        map: texture,
        transparent: true
      });
      errorMaterialArray = [errorPlywood, errorPlywoodDark];
      errorPlywoodMaterial = new THREE.MeshFaceMaterial(errorMaterialArray);

      initScene();
      initRenderer();
      initControls();
      initLights();

      stats = new Stats();
      container.appendChild( stats.dom );
      window.addEventListener( 'resize', onWindowResize, false );
      render();
      animate();

      generateContainer();
    },
    // Function called when download progresses
    function ( xhr ) {
      console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },
    // Function called when download errors
    function ( xhr ) {
      console.log( 'An error happened' );
    }
  );
}

function initScene() {
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.z = 300;
  camera.position.y = 100;
  camera.position.x = 150;

  // world
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
}

function initRenderer() {
  // renderer
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( scene.fog.color );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );
}

function initControls() {
  controls = new THREE.TrackballControls( camera,renderer.domElement );

  controls.rotateSpeed = 1.5;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.keys = [ 65, 83, 68 ];

  controls.addEventListener( 'change', render );
}

function initLights() {
  // lights
  hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  //hemiLight.color.setHSL( 0.6, 1, 0.6 );
  //hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( -500, 1000, 0 );
  scene.add( hemiLight );
  //
  dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( -500, 500, 300 );
  dirLight.position.multiplyScalar( 1.1 );
  scene.add(dirLight);
  dirLight.castShadow = true;
  dirLight.shadow.mapWidth = 4096;
  dirLight.shadow.mapHeight = 4096;
  var d = 500;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.far = 6000;
  dirLight.shadow.bias = -0.0001;

  var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
  var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x000000 } );
  ground = new THREE.Mesh( groundGeo, groundMat );
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -oHeight/2;
  scene.add( ground );
  ground.receiveShadow = true;

  var vertexShader = document.getElementById( 'vertexShader' ).textContent;
  var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
  var uniforms = {
    topColor:    { type: "c", value: new THREE.Color( 0x0077ff ) },
    bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
    offset:    { type: "f", value: 33 },
    exponent:  { type: "f", value: 0.6 }
  };
  uniforms.topColor.value.copy( hemiLight.color );
  scene.fog.color.copy( uniforms.bottomColor.value );
  var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
  var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
  var sky = new THREE.Mesh( skyGeo, skyMat );
  scene.add( sky );

  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.renderReverseSided = true;
}

function animate() {
  requestAnimationFrame( animate );
  controls.update();
}

function render() {
  renderer.render( scene, camera );
}

function onWindowResize() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize( width, height );
  render();
}