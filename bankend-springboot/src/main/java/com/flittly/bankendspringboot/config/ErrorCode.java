package com.flittly.bankendspringboot.config;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // 通用错误 1000-1999
    SUCCESS(0, "操作成功"),
    BAD_REQUEST(1000, "请求参数错误"),
    UNAUTHORIZED(1001, "未认证"),
    FORBIDDEN(1002, "无权限"),
    NOT_FOUND(1003, "资源不存在"),
    INTERNAL_ERROR(1004, "服务器内部错误"),

    // 认证相关 2000-2099
    USER_ALREADY_EXISTS(2000, "该邮箱或手机号已注册"),
    USER_NOT_FOUND(2001, "用户不存在"),
    INVALID_PASSWORD(2002, "密码错误"),
    INVALID_VERIFICATION_CODE(2003, "验证码错误"),
    VERIFICATION_CODE_EXPIRED(2004, "验证码已过期"),
    TOKEN_EXPIRED(2005, "Token 已过期"),
    TOKEN_INVALID(2006, "Token 无效"),
    REFRESH_TOKEN_INVALID(2007, "Refresh Token 无效"),
    REFRESH_TOKEN_REVOKED(2008, "Refresh Token 已失效"),
    ACCOUNT_DISABLED(2009, "账号已被禁用"),

    // 用户相关 2100-2199
    USER_UPDATE_FAILED(2100, "用户信息更新失败"),
    USER_PROGRESS_NOT_FOUND(2101, "用户进度不存在"),

    // 关卡相关 2200-2299
    LEVEL_NOT_FOUND(2200, "关卡不存在"),
    LEVEL_LOCKED(2201, "关卡未解锁"),
    LEVEL_PROGRESS_NOT_FOUND(2202, "关卡进度不存在"),

    // 题目相关 2300-2399
    QUESTION_NOT_FOUND(2300, "题目不存在"),
    QUIZ_SUBMIT_FAILED(2301, "答题提交失败"),

    // 错题本相关 2400-2499
    MISTAKE_NOT_FOUND(2400, "错题不存在"),
    MISTAKE_CREATE_FAILED(2401, "错题创建失败"),

    // 每日趣闻相关 2500-2599
    TRIVIA_NOT_FOUND(2500, "趣闻不存在"),
    TRIVIA_TODAY_NOT_FOUND(2501, "今日暂无趣闻"),

    // 地理特征相关 2600-2699
    GEO_FEATURE_NOT_FOUND(2600, "地理特征不存在"),
    GEO_FEATURE_SEARCH_FAILED(2601, "地理特征搜索失败"),

    // AR 地貌相关 2700-2799
    AR_LANDFORM_NOT_FOUND(2700, "AR 地貌不存在");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
