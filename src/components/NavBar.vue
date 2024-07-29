<script></script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-danger">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand">社團博覽會大地遊戲</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link active">首頁</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/stamp" class="nav-link active">蓋章</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/rank" class="nav-link active">排行榜</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
