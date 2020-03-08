var menuList = document.querySelector('.menu-list');
var addForm = document.getElementById('add-form');
var addSubmit = addForm.querySelector('input[type~="submit"]');
var studentList = menuList.querySelector('dd[data-page~="student-list"]');
var tbody = document.querySelector('tbody');
var modal = document.querySelector('.modal');
var editForm = document.getElementById('edit-form');
var editSubmit = modal.querySelector('input[type~="submit"]');
var mask = modal.querySelector('.mask');
var turnPage = document.getElementById("turn-page");
var showPage = document.querySelector('.show-page');
var studentObj = [];
var oPage = 1;
var oSize = 4;
var cont = getTableData(oPage, oSize).data.cont;

// 事件----------------------------------
// 导航栏中页面的切换
menuList.onclick = function (e) {
    if (e.target.tagName == "DD") {
        var activeList = this.getElementsByClassName('active');
        initStyle(activeList, 'active', e.target);
        var cPage = e.target.getAttribute('data-page');
        var activeContentList = document.getElementsByClassName('content-active');
        var content = document.getElementById(cPage);
        initStyle(activeContentList, 'content-active', content);
    }
}
console.log(studentObj);
// 新增学生----表单---提交按钮
addSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    var data = getFormData(addForm);
    var url = getUrl('/api/student/addStudent');
    var respance = saveData(url, data);
    if (respance.status === "fail") {
        alert(respance.msg);
    } else {
        alert('添加成功');
        addForm.reset();
        getTableData(oPage, oSize);
        studentList.click();
    }
});

// 学生列表----编辑按钮 || 删除按钮
tbody.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') {
        var name = e.target.classList;
        var index = e.target.getAttribute('data-index');
        var isEdit = [].slice.call(name, 0).indexOf('edit') > -1;
        if (isEdit) {
            modal.style.display = 'block';
            renderEditForm(studentObj[index]);
        } else {
            var url = getUrl('/api/student/delBySno');
            var respance = saveData(url, {
                appkey: 'Black_Sky_1575820660307',
                sNo: studentObj[index].sNo
            });
            if (respance.msg === 'fail') {
                alert(respance.msg);
            } else {
                alert("删除成功");
                getTableData(oPage, oSize);
            }
        }
    }
});

// 点击遮罩层的事件
mask.addEventListener('click', function () {
    modal.style.display = 'none';
})

// 学生列表----编辑按钮----修改表单----提交按钮
editSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    var data = getFormData(editForm);
    var url = getUrl('/api/student/updateStudent');
    var respance = saveData(url, data);
    if (respance.msg === "fail") {
        alert(respance.msg);
    } else {
        modal.style.display = 'none';
        getTableData(oPage, oSize);
        alert(respance.msg);
    }
})

// 学生列表----上一页 || 下一页
console.log(turnPage);
turnPage.addEventListener('click', function (e) {
    if (e.target.tagName === "BUTTON") {
        var isPrev = e.target.classList;
        isPrev = [].slice.call(isPrev, 0).indexOf('prev') > -1;
        if (isPrev && oPage != 1) {
            oPage--;
            getTableData(oPage, oSize);
        }
        if (!isPrev && oPage < Math.ceil(cont/oSize)) {
            console.log(oPage,Math.ceil(cont/oSize))
            oPage++;
            getTableData(oPage, oSize);
        }
    }
})
getTableData(oPage, oSize);



// 函数------------------------------------
/**
 * 状态切换
 * 消除原来有类名有active的元素，重新给新的元素添加
 * @param {} domList 要循环的dom节点
 * @param {String} toggleClass 切换的类名
 * @param {} dom 给哪个元素添加class类名
 */
function initStyle(domList, toggleClass, dom) {
    var len = domList.length;
    for (var i = 0; i < len; i++) {
        domList[i].classList.remove(toggleClass);
    }
    dom.classList.add(toggleClass);
}



/**
 * 按页获取学生信息数据
 */
function getTableData(page, size) {
    var url = getUrl('/api/student/findByPage');
    var respance = saveData(url, {
        appkey: 'Black_Sky_1575820660307',
        page: page,
        size: size
    });
    if (respance.status === 'success') {
        studentObj = respance.data.findByPage;
        randerTable(studentObj);
    }else{
        alert(respance.msg);
    }
    return respance;
}


/**
 * 对获取的数据进行渲染
 * @param {*} data 
 */
function randerTable(data) {
    var str = '';
    data.forEach(function (ele, index) {
        str +=
            `                        
        <tr>
        <td>${ele.sNo}</td>
        <td>${ele.name}</td>
        <td>${ele.sex}</td>
        <td>${ele.email}</td>
        <td>${ele.birth}</td>
        <td>${ele.phone}</td>
        <td>${ele.address}</td>
        <td>
            <button class="btn edit" data-index='${index}'>编辑</button>
            <button class="btn delete" data-index='${index}'>删除</button>
        </td>
        </tr>
            `
    })
    tbody.innerHTML = str;
    console.log(showPage);
    showPage.innerHTML = oPage + `/` + Math.ceil(cont/oSize); 
}

/**
 * 表单数据回填
 * @param {*} data 某个学生对象数据
 */
function renderEditForm(data) {
    var editForm = document.getElementById('edit-form');
    for (var prop in data) {
        if (editForm[prop]) {
            editForm[prop].value = data[prop];
        }
    }
}

/**
 * 获取接口地址的url
 * @param {String} urlL 接口的后半部分
 */
function getUrl(urlL) {
    var url = 'https://open.duyiedu.com';
    url = url + urlL;
    return url;
}

/**
 *  获取表单的数据 返回值是包含appkey的一个学生对象
 * @param {Object} domForm 想要获取数据的表单的dom元素
 */
function getFormData(domForm) {
    var name = domForm.name.value;
    var sex = domForm.sex.value;
    var email = domForm.email.value;
    var sNo = domForm.sNo.value;
    var birth = domForm.birth.value;
    var phone = domForm.phone.value;
    var address = domForm.address.value;
    if (!name || !sex || !email || !sNo || !birth || !phone || !address) {
        alert('信息填写不全！！！');
    } else {
        return {
            appkey: 'Black_Sky_1575820660307',
            name,
            sex,
            email,
            sNo,
            birth,
            phone,
            address
        };
    }
}

/**
 * 数据交互
 * @param {String} url 接口地址
 * @param {Object} param 请求参数
 */
function saveData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object') {
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}