<template>
  <div>
    <b-scroll :probeType="3" class="content">
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
        <li>8</li>
        <li>9</li>
        <li>10</li>
        <li>11</li>
        <li>12</li>
        <li>13</li>
        <li>14</li>
        <li>15</li>
        <li>16</li>
        <li>17</li>
        <li>18</li>
        <li>19</li>
        <li>20</li>
      </ul>
    </b-scroll>
  </div>
</template>

<script>
  import BScroll from 'components/common/bscroll/BetterScroll'
  export default {
    name: "Profile",
    components: {
      BScroll
    }
  }
</script>

<style scoped>
  .content{
    height: 300px;
    background-color: #f00;
    overflow: hidden;
  }
</style>
