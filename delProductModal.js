export default{
    template:`<div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="exampleModalCenterTitle">刪除商品</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <h5>是否刪除此商品： <strong>{{ tempProduct.title }}</strong></h5>
                <span class="text-danger">注意！刪除後將無法復原</span>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger" @click="delProduct">確認刪除</button>
            </div>
        </div>
    </div>`,
    data() {
      return {
      };
    },
    props: ['tempProduct', 'user'],
    methods: {
      // 刪除產品
      delProduct() {
        const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;

        //預設帶入 token
        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;

        axios.delete(url).then(() => {
          $('#delProductModal').modal('hide');
          this.$emit('update');
        });
      },
    }


}