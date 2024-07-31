<script></script>
<template>
  <div class="container w-75">
    <h1>社博大地遊戲</h1>
    <p class="d-inline-flex gap-1">
      <button
        class="btn btn-primary"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseExample"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        掃描 QRcode
      </button>
    </p>
    <div class="collapse" id="collapseExample">
      <div class="card card-body text-center">
        <img
          class="img-fluid mt-2 mb-4 rounded"
          src="https://quickchart.io/qr?size=500&margin=2&text=https://ttussc.github.io/Earth_Game"
          alt=""
        />
      </div>
    </div>
  </div>
</template>
