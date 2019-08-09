export default {
    data() {
        return {
            queryParam2: { wn: '' }
        }
    },
    props: {
        gutter: {
            type: Number,
            default: 48
        }, md: {
            type: Number,
            default: 8
        }, sm: {
            type: Number,
            default: 24
        }
    },
    render() {
        const table = (
            <a-row gutter={this.gutter}>
                <a-col md={8} sm={24}>
                    <a-form-item label="名称">
                        <a-input v-model={this.queryParam2.wn} placeholder="" />
                    </a-form-item>
                </a-col></a-row>)

        return (<div class="table-page-search-wrapper">
            <a-form layout="inline">
                {table}</a-form></div>)
    }
}
