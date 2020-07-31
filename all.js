//apiPath = 'https://course-ec-api.hexschool.io/api';

//import元件
import pagination from './pagination.js';
import modal from './modal.js';
import delProductModal from './delProductModal.js';

//定義全域元件
Vue.component('pagination', pagination);
Vue.component('modal', modal);
Vue.component('delProductModal', delProductModal);

new Vue({
    //將vue綁定在名為app的id
    el:'#app',
    //定義資料
    data:{
        user:{
            uuid:'36ef9eb4-b4df-4e7f-beae-46ff1b4c8cdd',
            path:'https://course-ec-api.hexschool.io/api',
            token: '',
        },
        products: [],
        tempProduct: {
            imageUrl: [],
            id:'',
        },
        pagination: {},
        isNew: true,
        
    },
    /**
     * 生命週期created
     * 主要用於取得token，若使用者沒有token，
     * 則返回到登入畫面，若有則執行「取得全部產品」getProducts()的方法   
     */
    created(){
        //將存在cookie的token取出
        this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        //預設帶入token（夾帶在headers裡被遠端伺服器發出請求）
        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
        //若無法取得token則返回Login頁面
        if (this.user.token === ''){
            window.location = 'login.html';
        }
        //執行取得全部產品的方法
        this.getProducts();
    },
    /**
     * 方法集：取得全部產品、新增產品、修改產品、刪除產品、打開Modal、上傳圖片
     */
    methods:{
        //取得資料列表
        getProducts(page = 1){
            //GET api / { uuid } / admin / ec / products
            const api = `${this.user.path}/${this.user.uuid}/admin/ec/products?page=${page}`;

            //斷遠端伺服器發出get products的請求
            axios.get(api)
                .then((response) => {
                    console.log(response);
                    this.products = response.data.data;
                    this.pagination = response.data.meta.pagination;

                    //判斷有無tempProduct（由外層來關閉Modal)
                    if(this.tempProduct.id){
                        this.tempProduct = {
                            imageUrl:[],
                        };
                        $('#productModal').modal('hide');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        
        //刪除商品
        delProduct(){
            if (this.tempProduct.id){
                const api = `${this.user.path}/${this.user.uuid}/admin/ec/products/${this.tempProduct.id}`;
                
                //預設帶入token
                axios.default.headers.common.Authorization = `Bearer ${this.user.token}`;
                axios.delete(api)
                    .then((response) => {
                        $('#delProductModal').modal('hide');
                        this.getProducts();
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        },

        openModal(isNew, item){
            switch (isNew) {
                case 'new':
                    this.tempProduct = { imageUrl: [] };
                    $('#productModal').modal('show');
                    break;
                case 'edit':
                    //後台取得單一商品細節：GET api/{uuid}/admin/ec/product/{id}
                    const api = `${this.user.path}/${this.user.uuid}/admin/ec/product/${item.id}`;
                    //console.log(item.id);
                    axios.get(api)
                        .then((response) => {
                            console.log(response);
                            this.tempProduct = response.data.data;
                            $('#productModal').modal('show');
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    break;
                case 'delete':
                    $('#delProductModal').modal('show');
                    this.tempProduct = Object.assign({},item);
                    break
                default:
                    break;
            }
        },
    },
});