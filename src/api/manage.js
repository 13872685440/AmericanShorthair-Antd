import { axios } from '@/utils/request'
import store from '@/store'
import qs from 'qs'

export function queryService(url, parameter) {
  if (parameter.userId == null || parameter.userId == '') {
    parameter.userId = store.getters.userInfo.id;
  }
  const param = qs.stringify(parameter, { arrayFormat: 'repeat' });
  return axios({
    url: url + "?" + param,
    method: 'get'
  })
}

export function saveService(url, parameter) {
  if (parameter.userId == null || parameter.userId == '') {
    parameter.userId = store.getters.userInfo.id;
  }
  const param = qs.stringify(parameter, { arrayFormat: 'repeat' });
  return axios({
    url: url + "?" + param,
    method: 'post'
  })
}

export function toService(method, url, parameter) {
  if (parameter.userId == null || parameter.userId == '') {
    parameter.userId = store.getters.userInfo.id;
  }
  const param = qs.stringify(parameter, { arrayFormat: 'repeat' });
  return axios({
    url: url + "?" + param,
    method: method
  })
}
export function download(path, params, fileName) {
  axios({
    url: path,
    method: "get",
    params: params,
    responseType: "blob"
  }).then(res => {
    let blob = new Blob([res]);
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      let link = document.createElement("a");
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", false, false);
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
    }
  });
}

export function save(that, savePath) {
  that.spinning = true;
  that.form.validateFields((err, values) => {
    if (!err) {
      saveService(savePath, values).then(() => {
        back_to_list(that);
        that.$notification.success({
          message: "保存成功",
          description: ""
        })
      }).catch(error => {
        that.spinning = false;
        console.log(error);
      }
      );
    } else {
      that.spinning = false;
    }
  });
}

export function submit(that, savePath, data) {
  that.spinning = true;
  that.form.validateFields((err, values) => {
    if (!err) {
      for (var p in data) {
        values[p] = data[p];
      }
      console.log("values", values)
      that.$confirm({
        title: "提示",
        content: "确认提交吗 ?",
        onOk() {
          saveService(savePath, values).then((res) => {
            if (res.code != '200') {
              that.$notification.error({
                message: "提交失败",
                description: res.message
              })
              that.spinning = false;
            } else {
              back_to_list(that);
              that.$notification.success({
                message: "提交成功",
                description: ""
              })
            }
          }).catch(error => {
            that.spinning = false;
            console.log(error);
          }
          );
        },
        onCancel() { that.spinning = false; }
      })
    } else {
      that.spinning = false;
    }
  });
}

export function submit_save(that, savePath, submitPath, data) {
  that.spinning = true;
  that.form.validateFields((err, values) => {
    if (!err) {
      for (var p in data) {
        values[p] = data[p];
      }
      console.log("values", values)
      that.$confirm({
        title: "提示",
        content: "确认提交吗 ?",
        onOk() {
          saveService(savePath, values).then((r) => {
            values.id = r.result.id;
            saveService(submitPath, values).then((res) => {
              if (res.code != '200') {
                that.$notification.error({
                  message: "提交失败",
                  description: res.message
                })
                that.spinning = false;
              } else {
                back_to_list(that);
                that.$notification.success({
                  message: "提交成功",
                  description: ""
                })
              }
            }).catch(error => {
              that.spinning = false;
              console.log(error);
            }
            );
          }).catch(error => {
            that.spinning = false;
            console.log(error);
          }
          );
        },
        onCancel() { that.spinning = false; }
      })
    } else {
      that.spinning = false;
    }
  });
}

export function submit_msg(that, savePath, data) {
  that.spinning = true;
  that.form.validateFields((err, values) => {
    if (!err) {
      for (var p in data) {
        values[p] = data[p];
      }
      console.log("values", values)
      saveService(savePath, values).then((res) => {
        if (res.code != '200') {
          that.$notification.error({
            message: "提交失败",
            description: res.message
          })
          that.spinning = false;
        } else {
          back_to_list(that);
          that.$notification.success({
            message: "提交成功",
            description: ""
          })
        }
      }).catch(error => {
        that.spinning = false;
        console.log(error);
      }
      );
    } else {
      that.spinning = false;
    }
  });
}

export function submit_save_msg(that, savePath, submitPath, data) {
  that.spinning = true;
  that.form.validateFields((err, values) => {
    if (!err) {
      for (var p in data) {
        values[p] = data[p];
      }
      console.log("values", values)
      saveService(savePath, values).then((r) => {
        values.id = r.result.id;
        saveService(submitPath, values).then((res) => {
          if (res.code != '200') {
            that.$notification.error({
              message: "提交失败",
              description: res.message
            })
            that.spinning = false;
          } else {
            back_to_list(that);
            that.$notification.success({
              message: "提交成功",
              description: ""
            })
          }
        }).catch(error => {
          that.spinning = false;
          console.log(error);
        }
        );
      }).catch(error => {
        that.spinning = false;
        console.log(error);
      }
      );
    } else {
      that.spinning = false;
    }
  });
}

export function handle_delete(that, id, path) {
  const parameter = { id: id };
  that.$confirm({
    title: "提示",
    content: "真的要删除该记录吗 ?",
    onOk() {
      toService("post", path, parameter).then(res => {
        if (res.code === "400") {
          that.$notification.error({
            message: "删除失败",
            description: "有相关子记录"
          });
        } else {
          that.$notification.success({
            message: "删除成功",
            description: ""
          });
          that.$refs.table.refresh(true);
        }
      });
    },
    onCancel() { }
  });
}

export function back_to_list(that) {
  that.$emit("edit", { id: "", state: "list" });
}