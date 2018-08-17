<template>
<div>
  <div v-html="sprite"></div>

  <div>
    <h3>&lt;svg&gt;&lt;use&gt;</h3>
    <svg style="width: 200px; height: 200px;">
      <use xlink:href="#bestdeals"></use>
    </svg>
    <svg style="width: 200px; height: 200px;">
      <use xlink:href="#profile"></use>
    </svg>
    <svg style="width: 200px; height: 200px;">
      <use xlink:href="#select"></use>
    </svg>
  </div>
</div>
</template>

<script>
import sprite from 'svg-sprite-loader/runtime/sprite.build';

import './images/bestdeals.svg';
import './images/profile.svg';
import './images/select.svg';

export default {
    data() {
      return {
        sprite: sprite.toString()
      }
    }
}
</script>

<style>

</style>
